import { describe, test, expect, beforeAll, beforeEach } from '@jest/globals';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import * as algokit from '@algorandfoundation/algokit-utils';
import { DaoClient } from '../contracts/clients/DaoClient';

const fixture = algorandFixture();
algokit.Config.configure({ populateAppCallResources: true });

let appClient: DaoClient

describe('dao', () => {
  beforeEach(fixture.beforeEach);
  const proposal = 'This is a proposal';
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

});
