import React, { useEffect, useState } from 'react';
import { Magic } from 'magic-sdk';
// import { AuthExtension } from '@magic-ext/auth';
import { OAuthExtension } from '@magic-ext/oauth';
import { WebAuthnExtension } from '@magic-ext/webauthn';
import { GDKMSExtension } from '@magic-ext/gdkms';
import Web3 from 'web3';
import './App.css';

// MA prod - pk_live_8D40A7E251F283ED
// MC prod - pk_live_5B191CBA25A24CAA
export const magic = new Magic('pk_live_8D40A7E251F283ED', {
  network: {
    rpcUrl: 'https://sepolia.infura.io/v3/23131c7335bc4a7e8c896624f61fad40',
  },
  extensions: [
    // new AuthExtension(), 
    new OAuthExtension(), new WebAuthnExtension(), new GDKMSExtension()],
});

function App() {
  const [user, setUser] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const web3 = new Web3((magic as any).rpcProvider);

  useEffect(() => {
    (async function () {
      setIsLoading(true);
      const isLoggedIn = await magic.user.isLoggedIn();
      if (isLoggedIn) {
        const data = await magic.user.getInfo();
        setUser(data);
        setIsLoading(false);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async () => {
    try {
      await magic.auth.loginWithEmailOTP({ email: 'hunter@magic.link' });
      const data = await magic.user.getInfo();
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  const isLoggedIn = async () => {
    try {
      const loggedIn = await magic.user.isLoggedIn();
      console.log('isLoggedIn', loggedIn);
    } catch (error) {
      console.log(error);
    }
  };

  const getInfo = async () => {
    try {
      const info = await magic.user.getInfo();
      console.log('getInfo', info);
    } catch (error) {
      console.log(error);
    }
  };

  const getIdToken = async () => {
    try {
      const token = await magic.user.getIdToken();
      console.log('getIdToken', token);
    } catch (error) {
      console.log(error);
    }
  };

  const getMetadata = async () => {
    try {
      const data = await magic.user.getMetadata();
      console.log('getMetadata', data);
    } catch (error) {
      console.log(error);
    }
  };

  const showSettings = async () => {
    try {
      await magic.user.showSettings();
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    try {
      await magic.user.logout();
      console.log('logout complete');
      setUser(null)
    } catch (error) {
      console.log(error);
    }
  };

  const magicLink = async () => {
    try {
      await magic.auth.loginWithMagicLink({ email: 'hunter@magic.link' });
      const data = await magic.user.getInfo();
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  const magicLinkRedirect = async () => {
    try {
      await magic.auth.loginWithMagicLink({ email: 'hunter@magic.link', redirectURI: 'http://localhost:3111/' });
      const data = await magic.user.getInfo();
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  const sms = async () => {
    try {
      await magic.auth.loginWithSMS({ phoneNumber: '+14017141831' });
      const data = await magic.user.getInfo();
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  const oauth = async () => {
    try {
      await magic.oauth.loginWithRedirect({ provider: 'google', redirectURI: 'http://localhost:3111/' });
    } catch (error) {
      console.log(error);
    }
  };

  const webauthn = async () => {
    // register a user by their username
    try {
      const token = await magic.webauthn.registerNewUser({ username: 'jul211106' });
      console.log('token', token);
    } catch (e) {
      // Handle errors if required!
      console.log(e);
      // log in a user by their username and set webauthn device nickname.
      try {
        const token = await magic.webauthn.login({ username: 'jul211106' });
        console.log('token', token);
      } catch (e) {
        // Handle errors if required!
      }
    }
  };

  const signTypedData = async () => {
    try {
      const signTypedDataV4Payload = {
        domain: {
          // Defining the chain aka Rinkeby testnet or Ethereum Main Net
          chainId: 11155111,
          // Give a user friendly name to the specific contract you are signing for.
          name: 'Ether Mail',
          // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
          verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
          // Just let's you know the latest version. Definitely make sure the field name is correct.
          version: '1',
        },

        // Defining the message signing data content.
        message: {
          /*
         - Anything you want. Just a JSON Blob that encodes the data you want to send
         - No required fields
         - This is DApp Specific
         - Be as explicit as possible when building out the message schema.
        */
          contents: 'Hello, Bob!',
          attachedMoneyInEth: 4.2,
          from: {
            name: 'Cow',
            wallets: ['0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826', '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF'],
          },
          to: [
            {
              name: 'Bob',
              wallets: [
                '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
                '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
                '0xB0B0b0b0b0b0B000000000000000000000000000',
              ],
            },
          ],
        },
        // Refers to the keys of the *types* object below.
        primaryType: 'Mail',
        types: {
          EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' },
          ],
          // Not an EIP712Domain definition
          Group: [
            { name: 'name', type: 'string' },
            { name: 'members', type: 'Person[]' },
          ],
          // Refer to PrimaryType
          Mail: [
            { name: 'from', type: 'Person' },
            { name: 'to', type: 'Person[]' },
            { name: 'contents', type: 'string' },
          ],
          // Not an EIP712Domain definition
          Person: [
            { name: 'name', type: 'string' },
            { name: 'wallets', type: 'address[]' },
          ],
        },
      };

      const params = [user.publicAddress, JSON.stringify(signTypedDataV4Payload)];
      const method = 'eth_signTypedData_v4';
      const signature = await (web3 as any).currentProvider.request({
        method,
        params,
      });
      console.log('signature', signature);
    } catch (error) {
      console.log(error);
    }
  };

  const sendTx = async () => {
    web3.eth
      .sendTransaction({
        from: user.publicAddress,
        to: user.publicAddress,
        value: web3.utils.toWei('0.001', 'ether'),
        gas: 21000,
      })
      .on('transactionHash', hash => {
        console.log('Transaction hash:', hash);
      })
      .then(receipt => {
        console.log('Transaction receipt:', receipt);
      })
      .catch(console.log);
  };

  const getAccountsAndPersonalSign = async () => {
    try {
      const user = await web3.eth.getAccounts();
      console.log('user', user);
      const signedMessage = await web3.eth.personal.sign('message', user[0], '');
      console.log(signedMessage);
    } catch (error) {
      console.log(error);
    }
  };

  const getBalance = async () => {
    try {
      const user = await web3.eth.getAccounts();
      web3.eth.getBalance(user[0]).then(console.log);
    } catch (error) {
      console.log(error);
    }
  };

  const encryptAndDecrypt = async () => {
    try {
      const message = await magic.gdkms.encryptWithPrivateKey('string');
      console.log(message);
      const recovered = await magic.gdkms.decryptWithPrivateKey(message);
      console.log(recovered);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {user ? <pre>User: {JSON.stringify(user, null, 2)}</pre> : <div>User not logged in</div>}
          <h1>MA</h1>
          <h2>Auth</h2>
          <button onClick={login}>Email OTP</button>
          <button onClick={magicLink}>Magic Link</button>
          <button onClick={magicLinkRedirect}>Magic Link w Redirect</button>
          <button onClick={sms}>SMS</button>
          <h2>User</h2>
          <button onClick={isLoggedIn}>isLoggedIn</button>
          <button onClick={getInfo}>getInfo</button>
          <button onClick={logout}>logout</button>
          <button onClick={getIdToken}>getIdToken</button>
          <button onClick={getMetadata}>getMetdata (deprecating)</button>
          <button onClick={showSettings}>showSettings</button>
          <h2>Web3</h2>
          <button onClick={sendTx}>Send eth tx</button>
          <button onClick={signTypedData}>sign typed data</button>
          <button onClick={getAccountsAndPersonalSign}>personal sign</button>
          <button onClick={getBalance}>get balance</button>
          <h2>Oauth</h2>
          <button onClick={oauth}>Oauth</button>
          <h2>WebAuthn</h2>
          <button onClick={webauthn}>WebAuthn</button>
          <h2>GDKMS</h2>
          <button onClick={encryptAndDecrypt}>Encrypt & decrypt</button>
          <h1>MC</h1>
          <h2>Wallet</h2>
          <button
            onClick={() => {
              magic.wallet.connectWithUI().then(console.log).catch(console.log);
            }}
          >
            Connect with UI
          </button>
          <button
            onClick={() => {
              magic.wallet.showUI().then(console.log).catch(console.log);
            }}
          >
            showUI
          </button>
          <button
            onClick={() => {
              magic.wallet.requestUserInfoWithUI().then(console.log).catch(console.log);
            }}
          >
            requestUserInfoWithUI (deprecating)
          </button>
          <button
            onClick={() => {
              magic.wallet.getInfo().then(console.log).catch(console.log);
            }}
          >
            getInfo (deprecating)
          </button>
          <button
            onClick={() => {
              magic.wallet.disconnect().then(console.log).catch(console.log);
            }}
          >
            disconnect (deprecating)
          </button>
          <h2>User</h2>
          <button onClick={isLoggedIn}>isLoggedIn</button>
          <button onClick={getInfo}>getInfo</button>
          <button onClick={logout}>logout</button>
          <button
            onClick={() => {
              magic.user.requestInfoWithUI().then(console.log).catch(console.log);
            }}
          >
            requestInfoWithUI
          </button>
          <h2>Web3</h2>
          <button onClick={sendTx}>Send eth tx</button>
          <button onClick={signTypedData}>sign typed data</button>
          <button onClick={getAccountsAndPersonalSign}>personal sign</button>
          <button onClick={getBalance}>get balance</button>
        </>
      )}
    </div>
  );
}

export default App;
