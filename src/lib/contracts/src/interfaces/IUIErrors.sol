// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IUIErrors {
    /// @notice Thrown when array lengths don't match
    error ArrayLengthMismatch();

    /// @notice Thrown when element doesn't exist
    /// @param id The ID that was attempted to be accessed
    error ElementDoesNotExist(uint256 id);

    /// @notice Thrown when invalid element IDs are provided
    /// @param parentId The parent element ID
    /// @param childId The child element ID
    error InvalidElementIDs(uint256 parentId, uint256 childId);

    /// @notice Thrown when properties and values arrays don't match
    error PropertiesValuesMismatch();

    /// @notice Thrown when attribute arrays don't match
    error AttributeArraysMismatch();
} 