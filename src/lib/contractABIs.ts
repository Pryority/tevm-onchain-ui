export const HTMLStoreABI = [
	"function getElement(uint256 _id) public view returns (string memory tagName, string memory innerHTML, bool exists)",
	"function getAttribute(uint256 _id, string memory _attrName) public view returns (string memory)",
	"function addElement(string memory _tagName, string memory _innerHTML, string[] memory _attrNames, string[] memory _attrValues) public returns (uint256)",
	"function elementCount() public view returns (uint256)",
] as const;

// Replace this with your actual deployed contract address
export const HTML_STORE_ADDRESS =
	"0x1234567890123456789012345678901234567890" as const;
