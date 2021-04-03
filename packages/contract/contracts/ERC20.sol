// SPDX-License-Identifier: MIT
pragma solidity >0.6.0 <0.8.0;

contract ERC20 {
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowances;

    uint256 public totalSupply;
    string public name;
    string public symbol;

    constructor(
        uint256 _initialSupply,
        string memory _name,
        string memory _symbol
    ) public {
        balances[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
        name = _name;
        symbol = _symbol;
    }

    function balanceOf(address _owner) external view returns (uint256) {
        return balances[_owner];
    }

    function transfer(address _to, uint256 _amount) external returns (bool) {
        require(balances[msg.sender] >= _amount, "You don't have enough balance to make this transfer!");

        balances[msg.sender] -= _amount;
        balances[_to] += _amount;

        emit Transfer(msg.sender, _to, _amount);

        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _amount
    ) external returns (bool) {
        require(
            balances[_from] >= _amount,
            "Can't transfer from the desired account because it doesn't have enough balance."
        );

        require(
            allowances[_from][msg.sender] >= _amount,
            "Can't transfer from the desired account because you don't have enough of an allowance."
        );

        balances[_to] += _amount;
        balances[_from] -= _amount;

        emit Transfer(_from, _to, _amount);

        return true;
    }

    function approve(address _spender, uint256 _amount) external returns (bool) {
        allowances[msg.sender][_spender] = _amount;

        emit Approval(msg.sender, _spender, _amount);

        return true;
    }

    function allowance(address _owner, address _spender) external view returns (uint256) {
        return allowances[_owner][_spender];
    }
}
