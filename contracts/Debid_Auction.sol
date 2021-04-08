pragma solidity >=0.4.22 <0.9.0;



/** TO DO  */

//Listing all bids (mapping address -> bid) 
//Transfer NFT to auction contract from owner
//Transfer NFT to highest bidder from contract
//


contract Debid_Auction {
    
    //All auctions array
    //Auction[] public auctions;
   
        address bidder;
        uint minBid;
        uint256 bidAmount;
        uint256 bidTime;

        address owner;
        string itemName;
        string itemDesc;
        uint256 auctionEndTime;
        uint256 startPrice;
        uint256 currentBid;
        address highestBidder;
        
        bool ended;

    
    mapping (address => uint) returnPrev_bid;
    mapping (address => uint) highestBid;
    
    event HighestBidIncreased(address bidder, uint amount);
    event AuctionEnded(address winner, uint amount);
    event Received(address, uint);
    
    /**
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
    */
    
    
    
    constructor(address _owner, uint _biddingTime, uint256 _minBid) public {
        owner = _owner;
        auctionEndTime = block.timestamp + _biddingTime;
        minBid = _minBid;
    }
    
    
    /**
    function createAuction(address _owner, string _itemName, string _itemDesc, uint256 _startPrice, uint256 _auctionEndTime) public returns(bool) {
        owner = _owner;
        itemName = _itemName;
        itemDesc = _itemDesc;
        startPrice = _startPrice;
        auctionEndTime = _auctionEndTime;
    }
    */
    
    
    
    
    
    
    function bid(address _highestBidder, uint256 _bidAmount) public{
        highestBidder = _highestBidder;
        bidAmount = _bidAmount;
        
        require(block.timestamp <= auctionEndTime, "Auction has ended!");
        require(bidAmount > minBid, "Bid amount must be greater than previous bid!");
        //bid func only works when bid is greater than the previous bid.
        
        if(bidAmount != 0) {
            returnPrev_bid[highestBidder] += bidAmount;
            minBid = bidAmount;
            //bid amount is mapped to the bidder who will get their refund again.
        }
        
        emit HighestBidIncreased(highestBidder, bidAmount);
        
    }
    
    
    function withdraw() public returns (bool) {
        uint amount = returnPrev_bid[highestBidder];
        if (amount > 0) {
            returnPrev_bid[highestBidder] = 0;
        }
        return true;
    }
    
    
    
    function auctionEnd() public {
        require(block.timestamp >= auctionEndTime);
        require(!ended);
        
        ended = true;
        emit AuctionEnded(highestBidder, bidAmount);
    }
    
    
    
    function highestBidderAddress() public view returns (address) {
        return highestBidder;
    }
    
    
    function getHighestBid() public view returns (uint256) {
        return bidAmount;
    }
    
    
    /**
    function getAuctionEndTime() view returns(uint256) {
        return auctionEndTime;
    }
    */
    
    
    
}


