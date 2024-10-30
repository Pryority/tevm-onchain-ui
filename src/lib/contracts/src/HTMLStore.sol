// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract HTMLStore {
    struct HTMLElement {
        string tagName;      // e.g., "div", "input", "p"
        string innerHTML;    // inner content or value
        mapping(string => string) attributes; // stores attributes like class, id, etc
        bool exists;
    }

    mapping(uint256 => HTMLElement) public elements;
    uint256 public elementCount;

    event ElementAdded(uint256 indexed id, string tagName);
    event ElementUpdated(uint256 indexed id);

    function addElement(
        string memory _tagName,
        string memory _innerHTML,
        string[] memory _attrNames,
        string[] memory _attrValues
    ) public returns (uint256) {
        require(_attrNames.length == _attrValues.length, "Arrays length mismatch");
        
        uint256 elementId = elementCount;
        HTMLElement storage element = elements[elementId];
        
        element.tagName = _tagName;
        element.innerHTML = _innerHTML;
        element.exists = true;

        for(uint i = 0; i < _attrNames.length; i++) {
            element.attributes[_attrNames[i]] = _attrValues[i];
        }

        elementCount++;
        emit ElementAdded(elementId, _tagName);
        return elementId;
    }

    function getElement(uint256 _id) public view returns (
        string memory tagName,
        string memory innerHTML,
        bool exists
    ) {
        require(_id < elementCount, "Element does not exist");
        HTMLElement storage element = elements[_id];
        return (element.tagName, element.innerHTML, element.exists);
    }

    function getAttribute(uint256 _id, string memory _attrName) public view returns (string memory) {
        require(_id < elementCount, "Element does not exist");
        return elements[_id].attributes[_attrName];
    }
} 