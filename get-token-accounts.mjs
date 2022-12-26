import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection } from "@solana/web3.js";
import fs from "fs";
const [_1, _2, rpc, mint, status, outputFile] = process.argv;

(async function () {
  const connection = new Connection(rpc);

  const holders = await connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
    filters: [
      {
        dataSize: 165,
      },
      {
        memcmp: {
          offset: 0,
          bytes: mint,
        },
      },
    ],
  });

  const output = holders
    .filter((h) => h.account.data.parsed.info.state === status)
    .map((h) => h.pubkey);

  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2), "utf-8");
})();
