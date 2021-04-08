
import { useEffect, useState } from 'react';
import Web3 from 'web3';
const web3 = new Web3(Web3.givenProvider)


import AuctionContract from '../build/contracts/Debid_Auction.json'


const Page = () => {

  const [myAccount, setMyAccount] = useState("")
  const [myBalance, setMyBalance] = useState(0)
  const [contractAddress, setContractAddress] = useState(null)
  
  let contract = new web3.eth.Contract(AuctionContract.abi, contractAddress)

  /**
   * Metamask üzerinden kendi hesabımızın bilgilerini çektiğimiz fonksiyon. 
   */
  const getAccount = async () => {
    const accounts = await web3.eth.getAccounts()
    if (accounts[0]) {
      setMyAccount(accounts[0])
    }
  }


  /**
   * Hesabımızın bakiyesini çektiğimiz fonksiyon.  
   */
  const getBalance = async () => {
    if (myAccount) {
      const balance = await web3.eth.getBalance(myAccount)
      if (balance) {
        setMyBalance(balance)
      }
    }
  }


  /**
   * Açık arttırma için, akıllı kontratımızı testnet e deploy ediyoruz.
   */
  const deployContract = async () => {
    /**
     * Deploy sonucunda gelecek fee yi hesaplatıyoruz. 
     */
    const gas = await contract.deploy({
      data: AuctionContract.bytecode,
      arguments:[
        myAccount,
        12022,
        2
      ],
    }).estimateGas()
  
    /**
     * Deploy işlemini gönderiyoruz.
     */
    contract.deploy({
      data: AuctionContract.bytecode,
      arguments:[
        myAccount,
        12022,
        2
      ],
    }).send({
      from: myAccount,
      gas: gas,
    })
    /**
     * Bir Hata gerçekleşirse bu fonksiyon çalışacak. 
     */
    .on('error', (error) => {
      console.log(error)
    })
    /**
     * İşleme ait tx hash geldiğinde burada yakalanıyor. şimdilik pek bir önemi yok.
     */
    .on('transactionHash', (transactionHash) => {
      console.log(transactionHash)
    })
    /**
     * Faturamız burada geliyor. Kontratımızın adresi de bize burada gönderiliyor ve üzerinde işlem yapabilmek için setContractAddress ile state'e aktarıyoruz
     */
    .on('receipt', (receipt) => {
       console.log(receipt)
       setContractAddress(receipt.contractAddress)
    })
    /**
     * İşlem onaylandığında buraya düşüyor. Şimdilik pek önemi yok.
     */
    .on('confirmation', (confirmationNumber, receipt) => {
      console.log(receipt)
    })
  }


  /**
   * Kontrata göre: en yüksek teklifi gösteren fonksiyon
   */
  const getHighestBid = async () => {
    alert(await contract.methods.getHighestBid().call())
  }

   /**
   * Kontrata göre: en yüksek teklifi veren kişinin adresini gösteren fonksiyon
   */
  const highestBidderAddress = async () => {
    alert(await contract.methods.highestBidderAddress().call())
  }

  /**
   * Kontrata göre: Açık arttırmayı bitir.
   */
  const auctionEnd = async () => {
    alert(JSON.stringify(await contract.methods.auctionEnd().call()))
    console.log(await contract.methods.auctionEnd().call())
  }

  /**
   * Kontrata göre: Emin değilim ama parayı çekme fonksiyonu sanırım.
   */
  const withdraw = async () => {
    alert(await contract.methods.withdraw().call())
  }

  /**
   * Kontrata göre: Teklif verme fonksiyonu, fakat remix.ethereum da çalışmasına rağmen burada çalıştıramadım
   */
  const bid = async () => {
    try {
      let highestBidderAddr = await contract.methods.highestBidderAddress().call()
      console.log(await contract.methods.bid(highestBidderAddr, 2376).call())
    } catch (error) {
      console.log(error)
      alert(error.message)
    }
  }


  /**
   * İlk çalışan fonksiyonumuz: Metamask'tan hesap bilgilerimizi ve bakiyemizi çekiyor.
   */
  const loadBlockChain = async () => {
    await getAccount()
    await getBalance()
  }

  /**
   * Sayfa yüklendiğinde sunucuda değil tarayıcıda çalıştığında bu kodun çalışması için gerekli önlem.
   * Eğer kodumuz tarayıcı yerine ServerSide render edilirse tarayıcımızdaki metamask cüzdanımızı görmeyebilir.
   */
  useEffect(() => {
    if (typeof window !== "undefined") {
      loadBlockChain()
    }
  }, 
  //  Eğer hesap ya da bakiye'de değişiklik olursa bunları tekrar yükle.
  [myAccount, myBalance])



  return (
    <body>

      <h1>Adresim: {myAccount}</h1>
      <h2>Bakiye: {myBalance}</h2>
      <h2>Kontrat Adresi: {contractAddress}</h2>

      <hr />


      <button onClick={deployContract}>Deploy Contract</button>
      <br />
      <button onClick={getHighestBid}>Call Contract: getHighestBid</button>
      <br />
      <button onClick={highestBidderAddress}>Call Contract: highestBidderAddress</button>
      <br />
      <button onClick={auctionEnd}>Call Contract: auctionEnd</button>
      <br />
      <button onClick={withdraw}>Call Contract: withdraw</button>
      <br />
      <button onClick={bid}>Call Contract: bid</button>

    </body>
  )

}


export default Page
