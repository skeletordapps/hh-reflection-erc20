// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.4;

import "./ERC20Mod.sol";

contract ChartToken is ERC20Mod {
    constructor() ERC20Mod("ChartToken", "CTK") {
        _mint(msg.sender, 10 * 10 ** decimals());
    }
}
