use solana_program::entrypoint::ProgramResult;
use solana_program::msg;
use solana_program::pubkey::Pubkey;
use solana_program::{account_info::AccountInfo, entrypoint};

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    msg!("Hello Solana! (From rust!)");
    Ok(())
}


// https://www.youtube.com/watch?v=51S58xcHHBw&list=PLUBKxx7QjtVnU3hkPc8GF1Jh4DE7cf4n1&index=2
