contract;
use std::{
    asset::*,
    hash::*,
    call_frames::msg_asset_id,
    context::msg_amount,
};

abi WatchTransfer {
    #[payable]
    #[storage(read,write)]
    fn watch(ID: u256 , recipient: Address);
}

pub struct SwapID {
    num: u256
}

storage {
    IDs: StorageMap<u256, bool> = StorageMap::<u256, bool> {},
}

impl WatchTransfer for Contract {
    #[payable]
    #[storage(read,write)]
    fn watch(ID: u256 , recipient: Address) {
        let exists = storage.IDs.get(ID).try_read().unwrap_or(false);
        require(!exists,"Id already exists");
        storage.IDs.insert(ID, true);
        transfer(Identity::Address(recipient), msg_asset_id(), msg_amount());
        log( SwapID {
            num: ID
        })
    }
}
