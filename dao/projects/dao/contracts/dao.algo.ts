import { Contract } from '@algorandfoundation/tealscript';

export class Dao extends Contract {
  // use global state to store the proposal
  proposal = GlobalStateKey<string>()


  //create an application to store the proposal
  createApplication(proposal: string): void {
    this.proposal.value = proposal;
  }

  //define a proposal
  getProposal():string{
    return this.proposal.value;
  }
}
