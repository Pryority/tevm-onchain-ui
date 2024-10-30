// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interfaces/IUIErrors.sol";

contract OnchainUI is IUIErrors {
    struct HTMLElement {
        string tagName;
        string innerHTML;
        mapping(string => string) attributes;
        uint256[] childElements;
        uint256 parentId;
        bool exists;
    }

    struct EventHandler {
        string eventType;
        string action;
        bytes payload;
    }

    struct Style {
        string selector;
        string[] properties;
        string[] values;
    }

    struct Template {
        string name;
        string tagName;
        string baseHTML;
        mapping(string => string) defaultAttributes;
        Style[] styles;
    }

    struct StateVariable {
        string name;
        bytes value;
        mapping(uint256 => bool) subscribedElements;
    }

    struct ComponentLibrary {
        string name;
        mapping(string => uint256) components;
    }

    struct ReactiveProperty {
        string name;
        bytes value;
        string[] dependentProps;
    }

    enum LayoutType { Flow, Grid, Flex }

    struct Layout {
        LayoutType layoutType;
        string[] properties;
        string[] values;
    }

    mapping(uint256 => HTMLElement) public elements;
    uint256 public elementCount;

    mapping(uint256 => mapping(string => EventHandler)) public elementEvents;
    mapping(uint256 => Style[]) public elementStyles;
    mapping(string => Template) public templates;
    mapping(string => StateVariable) public state;
    mapping(string => ComponentLibrary) public libraries;
    mapping(uint256 => mapping(string => ReactiveProperty)) public reactiveProps;
    mapping(uint256 => Layout) public elementLayouts;

    event ElementAdded(uint256 indexed id, string tagName);
    event ElementUpdated(uint256 indexed id);
    event StateUpdated(string name, bytes value);

    function addElement(
        string memory _tagName,
        string memory _innerHTML,
        string[] memory _attrNames,
        string[] memory _attrValues
    ) public returns (uint256) {
        if (_attrNames.length != _attrValues.length) {
            revert ArrayLengthMismatch();
        }
        
        uint256 elementId = elementCount;
        HTMLElement storage element = elements[elementId];
        
        element.tagName = _tagName;
        element.innerHTML = _innerHTML;
        element.exists = true;

        unchecked {
            for(uint256 i = 0; i < _attrNames.length; i++) {
                element.attributes[_attrNames[i]] = _attrValues[i];
            }
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
        if (_id >= elementCount) {
            revert ElementDoesNotExist(_id);
        }
        HTMLElement storage element = elements[_id];
        return (element.tagName, element.innerHTML, element.exists);
    }

    function getAttribute(uint256 _id, string memory _attrName) public view returns (string memory) {
        if (_id >= elementCount) {
            revert ElementDoesNotExist(_id);
        }
        return elements[_id].attributes[_attrName];
    }

    function addChildElement(uint256 parentId, uint256 childId) public {
        if (parentId >= elementCount || childId >= elementCount) {
            revert InvalidElementIDs(parentId, childId);
        }
        elements[parentId].childElements.push(childId);
        elements[childId].parentId = parentId;
    }

    function addEventHandler(
        uint256 elementId, 
        string memory eventType,
        string memory action,
        bytes memory payload
    ) public {
        if (elementId >= elementCount) {
            revert ElementDoesNotExist(elementId);
        }
        elementEvents[elementId][eventType] = EventHandler(eventType, action, payload);
    }

    function addStyle(
        uint256 elementId,
        string memory selector,
        string[] memory properties,
        string[] memory values
    ) public {
        if (elementId >= elementCount) {
            revert ElementDoesNotExist(elementId);
        }
        if (properties.length != values.length) {
            revert PropertiesValuesMismatch();
        }
        elementStyles[elementId].push(Style(selector, properties, values));
    }

    function createTemplate(
        string memory name,
        string memory tagName,
        string memory baseHTML,
        string[] memory attrNames,
        string[] memory attrValues
    ) public {
        if (attrNames.length != attrValues.length) {
            revert AttributeArraysMismatch();
        }
        Template storage newTemplate = templates[name];
        newTemplate.name = name;
        newTemplate.tagName = tagName;
        newTemplate.baseHTML = baseHTML;
        unchecked {
            for(uint256 i = 0; i < attrNames.length; i++) {
                newTemplate.defaultAttributes[attrNames[i]] = attrValues[i];
            }
        }
    }

    function updateState(
        string memory name,
        bytes memory value
    ) public {
        state[name].value = value;
        emit StateUpdated(name, value);
    }

    function addToLibrary(
        string memory libraryName,
        string memory componentName,
        uint256 elementId
    ) public {
        if (elementId >= elementCount) {
            revert ElementDoesNotExist(elementId);
        }
        libraries[libraryName].components[componentName] = elementId;
    }

    function setLayout(
        uint256 elementId,
        LayoutType layoutType,
        string[] memory properties,
        string[] memory values
    ) public {
        if (elementId >= elementCount) {
            revert ElementDoesNotExist(elementId);
        }
        if (properties.length != values.length) {
            revert PropertiesValuesMismatch();
        }
        elementLayouts[elementId] = Layout(layoutType, properties, values);
    }

    function getChildElements(uint256 _id) public view returns (uint256[] memory) {
        if (_id >= elementCount) {
            revert ElementDoesNotExist(_id);
        }
        return elements[_id].childElements;
    }

    function getParentId(uint256 _id) public view returns (uint256) {
        if (_id >= elementCount) {
            revert ElementDoesNotExist(_id);
        }
        return elements[_id].parentId;
    }
}