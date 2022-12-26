import { createThawAccountInstruction } from "@solana/spl-token";
import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { PromisePool } from "@supercharge/promise-pool";
import chunk from "chunk";
import fs from "fs";

const [_1, _2, rpc, keypath, mint, tokenAccountsFile] = process.argv;

const tokenAccounts = JSON.parse(fs.readFileSync(tokenAccountsFile, "utf-8"));

(async function () {
  const connection = new Connection(rpc, "processed");
  const keypair = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(keypath, "utf-8")))
  );
  const mintPubkey = new PublicKey(mint);

  const chunks = chunk(tokenAccounts, 20);

  await PromisePool.withConcurrency(5)
    .for(chunks)
    .process(async (tokenAccounts) => {
      const ix = chunks.indexOf(tokenAccounts);
      try {
        const instructions = tokenAccounts.map((account) =>
          createThawAccountInstruction(
            new PublicKey(account),
            mintPubkey,
            keypair.publicKey
          )
        );

        const { blockhash, lastValidBlockHeight } =
          await connection.getLatestBlockhash();
        const transaction = new Transaction();
        transaction.add(...instructions);

        transaction.feePayer = keypair.publicKey;
        transaction.recentBlockhash = blockhash;
        transaction.lastValidBlockHeight = lastValidBlockHeight;

        transaction.sign(keypair);

        const signature = await connection.sendRawTransaction(
          transaction.serialize()
        );

        console.info(signature);

        await connection.confirmTransaction(
          {
            signature,
            blockhash,
            lastValidBlockHeight,
          },
          "processed"
        );

        console.info(`Chunk #${ix} thawed:\n`, tokenAccounts.join("\n"));
      } catch (err) {
        console.error(err);
        console.error(
          `Error thawing chunk #${ix}:\n`,
          tokenAccounts.join("\n")
        );
      }
    });
})();
