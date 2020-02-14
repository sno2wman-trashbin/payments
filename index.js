const { Octokit } = require("@octokit/rest");
const csv = require("csv-parse");
const { promisify } = require("util");
const axios = require("axios");

const { GITHUB_TOKEN, GIST_ID, DISPLAY_CURRENCY, DISPLAY_LOCALE } = process.env;

const octokit = new Octokit({
  auth: `token ${GITHUB_TOKEN}`
});

function toMonth(duration) {
  if (duration === "MONTH") return 1;
  else if (duration === "YEAR") return 12;
}

function per(duration, to) {
  return toMonth(to) / toMonth(duration);
}

function line({ 0: name, 1: amount, 2: currency, 3: duration }) {
  const amountMonth = (to, rates) =>
    (((amount / toMonth(duration)) * toMonth("MONTH")) / rates[currency]) *
    rates[to];
  const amountYear = (to, rates) =>
    (((amount / toMonth(duration)) * toMonth("YEAR")) / rates[currency]) *
    rates[to];
  return { name, amountMonth, amountYear, currency };
}

(async () => {
  const {
    data: { rates, date }
  } = await axios("https://api.exchangeratesapi.io/latest", {
    params: { base: "USD" }
  });
  const { data } = await octokit.gists.get({ gist_id: GIST_ID });
  const { content: out } = data.files["expense.csv"];
  const expense = await promisify(csv)(out);

  const formater = Intl.NumberFormat(DISPLAY_LOCALE, {
    style: "currency",
    currency: DISPLAY_CURRENCY
  });

  const lines = expense.splice(1).map(line);
  const aveMonth = lines.reduce(
    (p, c) => (p += c.amountMonth(DISPLAY_CURRENCY, rates)),
    0
  );
  const aveYear = lines.reduce(
    (p, c) => (p += c.amountYear(DISPLAY_CURRENCY, rates)),
    0
  );
  await octokit.gists.update({
    gist_id: GIST_ID,
    files: {
      ...data.files,
      "Report.md": {
        content: [
          "# 📝 Report",
          "## 💸 Expense",
          "|name|monthly|yearly|",
          "|---|---|---|",
          `|**ALL**|\`${formater.format(aveMonth)}\`|\`${formater.format(
            aveYear
          )}\`|`,
          ...lines.map(
            ({ name, amountMonth, amountYear }) =>
              `|${name}|\`${formater.format(
                amountMonth(DISPLAY_CURRENCY, rates)
              )}\`|\`${formater.format(amountYear(DISPLAY_CURRENCY, rates))}\`|`
          ),
          "## 💹 Rates",
          `${date} by [exchangeratesapi.io](https://exchangeratesapi.io)`,
          "```",
          ...[...new Set(lines.map(({ currency }) => currency))].map(
            currency => `${rates["USD"]} USD = ${rates[currency]} ${currency}`
          ),
          "```"
        ].join("\n")
      }
    }
  });
})();
