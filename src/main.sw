contract;
use std::{
    asset::*,
};

abi WatchTransfer {
    fn watch(recipient: Address, asset_id: AssetId, amount: u64);
}

impl WatchTransfer for Contract {

    fn watch(recipient: Address, asset_id: AssetId, amount: u64) {
        transfer(Identity::Address(recipient), asset_id, amount);
    }
}
