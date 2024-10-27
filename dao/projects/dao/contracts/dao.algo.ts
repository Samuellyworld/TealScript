import { Contract } from '@algorandfoundation/tealscript';

export class Dao extends Contract {
  

  registeredAsaId = GlobalStateKey<AssetID>();

  // use global state to store the proposal
  proposal = GlobalStateKey<string>()

  // votes in total
  votesTotal = GlobalStateKey<uint64>()

  // votes in favour
  votesInFavour = GlobalStateKey<uint64>()

  //create an application to store the proposal
  createApplication(proposal: string): void {
    this.proposal.value = proposal;
  }

  // mint DAO token
  bootstrap(): AssetID {
    // VERIFIY THIS IS ONLY CALLED BY THE APP CREATOR
    verifyTxn(this.txn, {
      sender: this.app.address,
    })
    // make sure the ASA is not already registered
    assert(!this.registeredAsaId.exists)
    const registeredASA = sendAssetCreation({
      configAssetTotal: 1_000,
      configAssetFreeze: this.app.address
    })

    return registeredASA
  }

/// register method that gives the person the ASA and then freezes it
// eslint-disable-next-line @typescript-eslint/no-unused-vars
register(registeredASA: AssetID): void {
  // assert(this.txn.sender.assetBalance(this.registeredAsaId) == 0)
  
  sendAssetTransfer({
    xferAsset : this.registeredAsaId.value,
    assetReceiver : this.txn.sender,
    assetAmount : 1
  })
  sendAssetFreeze({
    freezeAsset : this.registeredAsaId.value,
    freezeAssetAccount : this.txn.sender,
    freezeAssetFrozen : true
  })
}
    //method so user can be in favour or not
  vote(inFavour : boolean) : void {
    this.votesTotal.value =  this.votesTotal.value + 1;
    if (inFavour) {
      this.votesInFavour.value = this.votesInFavour.value + 1;
    }
  }

  //define a proposal
  getProposal():string{
    return this.proposal.value;
  }

  //get both votes
  getVotes(): [uint64, uint64] {
    return [this.votesInFavour.value, this.votesTotal.value];
  }


}
