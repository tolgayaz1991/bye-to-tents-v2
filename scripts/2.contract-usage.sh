#!/usr/bin/env bash

# exit on first error after this point to avoid redeploying with successful build
set -e

echo
echo ---------------------------------------------------------------------------------
echo "Step 0a: Check for environment variable with contract name"
echo ---------------------------------------------------------------------------------
echo

[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$CONTRACT" ] || echo "Found it! \$CONTRACT is set to [ $CONTRACT ]"

echo
echo ---------------------------------------------------------------------------------
echo "Step 0b: Clear all houses that were in the campaign before for demo purposes"
echo ---------------------------------------------------------------------------------
echo

near call $CONTRACT clearAllHouses --accountId $CONTRACT


echo
echo
echo ----------------------------------------------------------------------------------------------------------------
echo "Step 1: call returnHouses 'view' function on the contract to see if there is a house to donate in the campaign"
echo ----------------------------------------------------------------------------------------------------------------
echo

near view $CONTRACT returnHouses


echo
echo
echo ----------------------------------------------------------------------------------------------------
echo "Step 2: Call addHouse 'change' function to add a house to be donated to the Bye-To-Tents campaign"
echo "Observe the arguments given ('fundNeed' and 'numOfHouses')"
echo ----------------------------------------------------------------------------------------------------
echo

near call $CONTRACT addHouse '{"fundNeed":"55000000000000000000000000", "numOfHouses":"1"}' --accountId $CONTRACT


echo
echo
echo ----------------------------------------------------------------------------------------------------
echo "Step 3: call returnHouses 'view' function again to see the house(s) to donate"
echo ----------------------------------------------------------------------------------------------------
echo


near view $CONTRACT returnHouses


echo
echo
echo ----------------------------------------------------------------------------------------------------
echo "Step 4:  call addHouse 'change' function to add more house(s) to donate"
echo ----------------------------------------------------------------------------------------------------
echo


near call $CONTRACT addHouse '{"fundNeed":"150000000000000000000000000", "numOfHouses":"10"}' --accountId $CONTRACT --gas 100000000000000


echo
echo
echo ----------------------------------------------------------------------------------------------------
echo "Step 5: call returnHouses 'view' function again to see the added house(s) to donate"
echo ----------------------------------------------------------------------------------------------------
echo


near view $CONTRACT returnHouses


echo
echo
echo -----------------------------------------------------------------------------------------------------------------
echo "Step 6:  call getDetailsByHouseId function to see the details about a house that you provide its id as argument"
echo -----------------------------------------------------------------------------------------------------------------
echo


near call $CONTRACT getDetailsByHouseId '{"houseId":"0"}' --accountId $CONTRACT


echo
echo
echo -----------------------------------------------------------------------------------------------------------------
echo "Step 7:  call donateById function to donate some amount to a house that you provide its id as argument"
echo "Observe the arguments given ('houseId')"
echo -----------------------------------------------------------------------------------------------------------------
echo


near call $CONTRACT donateById '{"houseId":"0"}' --amount=1 --accountId $CONTRACT


echo
echo
echo -----------------------------------------------------------------------------------------------------------------
echo "Step 8:  call getDetailsByHouseId again to see the change in the details of the house that you donated to"
echo -----------------------------------------------------------------------------------------------------------------
echo


near call $CONTRACT getDetailsByHouseId '{"houseId":"0"}' --accountId $CONTRACT


echo
echo
echo -----------------------------------------------------------------------------------------------------------------
echo "Step 9:  call donateById and try to donate more than the required amount for the house"
echo -----------------------------------------------------------------------------------------------------------------
echo


near call $CONTRACT donateById '{"houseId":"0"}' --amount=10 --accountId $CONTRACT


echo
echo
echo -----------------------------------------------------------------------------------------------------------------
echo "Step 10:  call donateById and donate the remaining required amount for the house"
echo -----------------------------------------------------------------------------------------------------------------
echo


near call $CONTRACT donateById '{"houseId":"1"}' --amount=75 --accountId $CONTRACT


echo
echo
echo -----------------------------------------------------------------------------------------------------------------
echo "Step 11:  call getDetailsByHouseId to see the details of the house that you donated to again"
echo -----------------------------------------------------------------------------------------------------------------
echo


near call $CONTRACT getDetailsByHouseId '{"houseId":"1"}' --accountId $CONTRACT


echo
echo
exit 0