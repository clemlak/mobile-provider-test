import React, { Component } from 'react';
import Web3 from 'web3';

class App extends Component {
  constructor(props) {
    super(props);

    this.networkId = 3;

    this.state = {
      providerName: '',
      isProviderInstalled: false,
      isProviderUnlocked: false,
      networkId: -1,
      address: '',
    };
  }

  componentDidMount = () => {
    if (typeof window.ethereum !== 'undefined') {
      window.web3 = new Web3(window.ethereum);

      this.setState({
        isProviderInstalled: true,
      });

      window.ethereum.enable()
        .then(() => {
          this.setState({
            isProviderUnlocked: true,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (typeof window.web3 !== 'undefined') {
      window.web3 = new Web3(window.web3.currentProvider);

      this.setState({
        isProviderInstalled: true,
        isProviderUnlocked: true,
      });
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    const {
      isProviderInstalled,
    } = this.state;

    if (isProviderInstalled !== prevState.isProviderInstalled) {
      this.getDetails();
    }
  }

  getDetails = () => {
    let providerName;

    if (window.web3.currentProvider.isMetaMask) {
      providerName = 'MetaMask';
    } else if (window.web3.currentProvider.isCipher) {
      providerName = 'Cipher';
    } else if (window.web3.currentProvider.isTrust) {
      providerName = 'Trust';
    } else if (window.web3.currentProvider.isToshi) {
      providerName = 'Toshi';
    } else {
      providerName = 'Unknown';
    }

    this.setState({
      providerName,
    });

    window.web3.eth.getAccounts()
      .then((accounts) => {
        if (accounts.length > 0) {
          this.setState({
            address: accounts[0],
          });
        }

        return window.web3.eth.net.getId();
      })
      .then((networkId) => {
        this.setState({
          networkId,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  checkProvider = () => {
    const {
      providerName,
      isProviderInstalled,
      isProviderUnlocked,
      address,
      networkId,
    } = this.state;

    const foo = [];

    if (isProviderInstalled) {
      foo.push(
        <li key="providerInstalled">
          <span role="img" aria-label="checked">✔️</span>
          A web3 browser is installed
        </li>,
      );
    } else {
      foo.push(
        <li key="providerInstalled">
          <span role="img" aria-label="cross">❌</span>
          No web3 browser found
        </li>,
      );

      return (
        <ul>
          {foo}
        </ul>
      );
    }

    if (providerName !== '') {
      foo.push(
        <li key="providerName">
          <span role="img" aria-label="checked">✔️</span>
          {`Your web3 browser is ${providerName}`}
        </li>,
      );
    } else {
      foo.push(
        <li key="providerName">
          <span role="img" aria-label="cross">❌</span>
          Web3 browser is unknown
        </li>,
      );
    }

    if (isProviderUnlocked) {
      foo.push(
        <li key="providerUnlocked">
          <span role="img" aria-label="unlocked">🔓</span>
        Web3 browser is unlocked
        </li>,
      );
    } else {
      foo.push(
        <li key="providerUnlocked">
          <span role="img" aria-label="locked">🔒</span>
          Web wallet is locked
        </li>,
      );

      return (
        <ul>
          {foo}
        </ul>
      );
    }

    if (address.length > 0) {
      foo.push(
        <li key="address">
          <span role="img" aria-label="found">📫</span>
          {`Your address is: ${address}`}
        </li>,
      );
    } else {
      foo.push(
        <li key="address">
          <span role="img" aria-label="unfound">❌</span>
          No address found
        </li>,
      );

      return (
        <ul>
          {foo}
        </ul>
      );
    }

    if (networkId !== -1) {
      foo.push(
        <li key="networkId">
          <span role="img" aria-label="planet">🌍</span>
          {`Your are connected to network ${networkId}`}
        </li>,
      );
    } else {
      foo.push(
        <li key="networkId">
          <span role="img" aria-label="">❌</span>
          No network found
        </li>,
      );

      return (
        <ul>
          {foo}
        </ul>
      );
    }

    return (
      <ul>
        {foo}
      </ul>
    );
  }

  render = () => (
    <div>
      {this.checkProvider()}
    </div>
  );
}

export default App;
