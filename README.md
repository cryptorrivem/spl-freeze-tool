# SPL tokens freeze/thaw tool

Scripts for getting SPL tokens with `enable-freeze` flag, filter by status, and later thawing or freezing all accounts for a list of token accounts.

## Setup

```
npm install
```

# Tools

## Get token accounts

First, you need to obtain all token accounts for a mint you have enable the freeze authority, and only export the ones in the desired state.

```
node get-token-accounts.mjs [rpc] [mint] [status] [output-file]

[rpc]:          Solana RPC to use, requires ability to call `getProgramAccounts`
[mint]:         Public key of the mint to fetch token accounts
[status]:       Status of the token accounts to keep (`frozen` for accounts that have been frozen, or `initialized` for accounts that can be freely used)
[output-file]:  JSON file to write the accounts public keys for later use
```

## Thawing accounts

With the list of frozen token accounts, use this script to thaw all the accounts quickly. You'll need the keypair of the freeze authority of the mint. All token accounts provided to the script must be in frozen state to succeed. The script runs with 5 parallel transactions of 20 thaw instructions each.

```
node thaw-list.mjs [rpc] [keypair] [mint] [input-file]

[rpc]:          Solana RPC to use
[keypaird]:     Private key file (JSON) of the freeze authority for the mint
[mint]:         Public key of the mint
[input-file]:  JSON file with the list of token accounts that are frozen
```

## Freezing accounts

With the list of initialized token accounts, use this script to freeze all the accounts quickly. You'll need the keypair of the freeze authority of the mint. All token accounts provided to the script must be in initialized state to succeed. The script runs with 5 parallel transactions of 20 thaw instructions each.

```
node freeze-list.mjs [rpc] [keypair] [mint] [input-file]

[rpc]:          Solana RPC to use
[keypaird]:     Private key file (JSON) of the freeze authority for the mint
[mint]:         Public key of the mint
[input-file]:  JSON file with the list of token accounts that are initialized
```
