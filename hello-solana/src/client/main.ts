import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import fs from "fs/promises";
import path from "path";

const PROGRAM_KEYPAIR_PATH = path.join(
  path.resolve(__dirname, "../../dist/program"),
  "program-keypair.json",
);

async function main() {
  console.log("Launching client");

  // let connection = new Connection("https://api.devnet.solana.com", "confirmed");
  let connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const secretKeyString = await fs.readFile(PROGRAM_KEYPAIR_PATH, { encoding: "utf8" });
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  const programKeypair = Keypair.fromSecretKey(secretKey);

  let programId: PublicKey = programKeypair.publicKey;

  const triggerKeypair = Keypair.generate();
  const airdropRequest = await connection.requestAirdrop(
    triggerKeypair.publicKey,
    LAMPORTS_PER_SOL,
  );
  // @ts-ignore
  await connection.confirmTransaction({ signature: airdropRequest });
  // await connection.confirmTransaction(airdropRequest);

  console.log("--Pinging Program", programId.toBase58());
  const instruction = new TransactionInstruction({
    keys: [{ pubkey: triggerKeypair.publicKey, isSigner: false, isWritable: true }],
    programId,
    data: Buffer.alloc(0),
  });
  // @ts-ignore
  await sendAndConfirmTransaction(connection, new Transaction().add(instruction), [triggerKeypair]);
}

main()
  .then(() => process.exit())
  .catch(() => process.exit(-1));
