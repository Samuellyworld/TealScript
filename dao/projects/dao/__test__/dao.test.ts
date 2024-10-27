import { describe, test, expect, beforeAll, beforeEach } from '@jest/globals';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import * as algokit from '@algorandfoundation/algokit-utils';
import { DaoClient } from '../contracts/clients/DaoClient';
import algosdk from 'algosdk';

const fixture = algorandFixture();
algokit.Config.configure({ populateAppCallResources: true });

let appClient: DaoClient

describe('dao', () => {

  // define registered ASA
  let registeredAsa : BigInt;
  let algod: algosdk.Algodv2;
  let sender : algosdk.Account;
  const proposal = 'This is a proposal';
  beforeEach(fixture.beforeEach);
  beforeAll(async () => {
    await fixture.beforeEach();
    const { testAccount } = fixture.context;
    const { algorand } = fixture;

    appClient = new DaoClient(
      {
        sender: testAccount,
        resolveBy: 'id',
        id: 0,
      },
      algorand.client.algod
    );

    await appClient.create.createApplication({ proposal });
  });

  test('gets proposal', async () => {
   const getProposalFromMethod = await appClient.getProposal({});
   expect(getProposalFromMethod.return?.valueOf()).toBe(proposal);
  });

  test("bootstrap", async () => {
    await appClient.appClient.fundAppAccount(algokit.microAlgos(200_000));
    //default feed is 0.0001 ALGO
   const bootstrapResult = await appClient.bootstrap({}, {
      sendParams : {
        fee : algokit.microAlgos(2_000)
      }
    });
    registeredAsa =  bootstrapResult.return!.valueOf();
  })

  test("votes and gets votes", async () => {
    await appClient.vote({ inFavour: true });
    const votes = await appClient.getVotes({});
    expect(votes.return?.valueOf()).toEqual([BigInt(1), BigInt(1)]);

    await appClient.vote({ inFavour: false });
    const votes2 = await appClient.getVotes({});
    expect(votes2.return?.valueOf()).toEqual([BigInt(1), BigInt(2)]);
  }
  );

  test("register", async () => {
    const registeredASAOptinTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: sender.addr,
      to: sender.addr,
      amount: 0,
      suggestedParams: await algokit.getTransactionParams(undefined, algod),
      assetIndex: Number(registeredAsa),
    })
    await algokit.sendTransaction({
      from : sender,
      transaction: registeredASAOptinTxn
    }, algod);
     await appClient.register({registeredAsa}, {
      sender,
      sendParams : {
        fee : algokit.microAlgos(3_000)
      }
     });
  })



});
