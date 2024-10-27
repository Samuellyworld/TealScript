import { Contract } from '@algorandfoundation/tealscript';

export class Dao extends Contract {
  // use global state to store the proposal
  proposal = GlobalStateKey<string>()

  // votes in total
  votesTotal = GlobalStateKey<uint64>()

  // votes in favour
  votesInFavour = GlobalStateKey<uint64>()

  //method so user can be in favour or not
  vote(inFavour : boolean) : void {
    this.votesTotal.value =  this.votesTotal.value + 1;
    if (inFavour) {
      this.votesInFavour.value = this.votesInFavour.value + 1;
    }
  }
  //create an application to store the proposal
  createApplication(proposal: string): void {
    this.proposal.value = proposal;
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
