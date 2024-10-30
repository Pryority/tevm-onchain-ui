export const ONCHAIN_UI_ABI = [
	"function getElement(uint256 _id) public view returns (string memory tagName, string memory innerHTML, bool exists)",
	"function getAttribute(uint256 _id, string memory _attrName) public view returns (string memory)",
	"function addElement(string memory _tagName, string memory _innerHTML, string[] memory _attrNames, string[] memory _attrValues) public returns (uint256)",
	"function elementCount() public view returns (uint256)",
	"function addChildElement(uint256 parentId, uint256 childId) public",
	"function addEventHandler(uint256 elementId, string memory eventType, string memory action, bytes memory payload) public",
	"function addStyle(uint256 elementId, string memory selector, string[] memory properties, string[] memory values) public",
	"function createTemplate(string memory name, string memory tagName, string memory baseHTML, string[] memory attrNames, string[] memory attrValues) public",
	"function updateState(string memory name, bytes memory value) public",
	"function setLayout(uint256 elementId, uint8 layoutType, string[] memory properties, string[] memory values) public",
	"function getChildElements(uint256 _id) public view returns (uint256[] memory)",
	"function getParentId(uint256 _id) public view returns (uint256)",
] as const;
