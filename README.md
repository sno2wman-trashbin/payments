# SUBSCRIPTION REPORTER

_Report how much you are spending on your subscription._

[@SnO2WMaN's Report](https://gist.github.com/SnO2WMaN/9c8d02f166de5fabbf6b7e9253e45434#file-report-md)

Rates API by [exchangeratesapi.io](https://exchangeratesapi.io)

## Usage

1. Folk it.
2. [Create `expense.csv`](https://gist.new) and save Gist ID.
3. Add Environment Variables to Github Secrets. See [here](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets).

### ⚙️ ENVIRONMENT VARIABLES

[Example](https://gist.github.com/SnO2WMaN/9c8d02f166de5fabbf6b7e9253e45434)

```env
GITHUB_GIST_TOKEN=***
GIST_ID=9c8d02f166de5fabbf6b7e9253e45434
DISPLAY_CURRENCY=JPY
DISPLAY_LOCALE=ja-JP
```

`GITHUB_GIST_TOKEN` must have `gist` scope. See [here](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps).

### 💸 `expense.csv`

```csv
name,amount,currency,duration
Spotify,980,JPY,MONTH
```

| property | description                                                         | example             |
| -------- | ------------------------------------------------------------------- | ------------------- |
| name     | Name                                                                | `Spotify`, `Github` |
| amount   | Amount                                                              | `980`, `1.25`       |
| currency | [ISO4217 Code](https://en.wikipedia.org/wiki/ISO_4217#Active_codes) | `JPY`, `USD`        |
| duration | Duration                                                            | `MONTH`, `YEAR`     |

⚠️ **WARNING** Do not change the order of the properties.
