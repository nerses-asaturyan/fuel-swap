contract;
use std::{
    asset::*,
};

abi WatchTransfer {
    fn transfer_to_address(recipient: Address, asset_id: AssetId, amount: u64);
}

impl WatchTransfer for Contract {

    fn transfer_to_address(recipient: Address, asset_id: AssetId, amount: u64) {
        transfer(Identity::Address(recipient), asset_id, amount);
    }
}
