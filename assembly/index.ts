import { context, storage, PersistentUnorderedMap, u128, ContractPromiseBatch} from "near-sdk-as"
import { House, houses} from './model';


// change function(s)

// register houses to be funded by donators (only allowed accounts can do -code to be added later-)
export function addHouse(fundNeed:u128, numOfHouses:u64):string {

    assert(numOfHouses <= 100,"You can add at most 100 houses at one call.")

    let houseId:u64 = 0;
    let initiator = context.sender;

    if (!houses.contains("0")) {
        houseId = 0;
    }
    else {
        houseId = houses.length;
    }


    for(let i:u64 = 0; i < numOfHouses; i++) {
    
    let house = new House(houseId.toString(),initiator,fundNeed);
    houses.set(houseId.toString(),house);
    houseId  += 1;
    }


    return numOfHouses.toString() + " house(s) were registered by " + initiator;

}

//clear all houses (for demo purpose only)
export function clearAllHouses():string {
    assert(houses.length != 0, "There is no house to clear yet.")
    houses.clear();
    return "All houses were cleared successfully."
}


//donate to a house by id
export function donateById(houseId:u64): string {

    assert(houses.length != 0, "Donation is unsuccessful. There is no house to donate yet.")
    assert(houses.contains(houseId.toString()), "Donation is unsuccessful. The house id that you entered does not exist, try again with different house id.")
    assert(context.attachedDeposit > u128.Zero, "Donation is unsuccessful. The donation amount should be greater than 0 Near.")
    
    let houseToDonate = houses.getSome(houseId.toString());
    houseToDonate.donate();

    houses.set(houseId.toString(),houseToDonate);

    return "Donation " + (context.attachedDeposit.toF64()/10**24).toString() + " Near by " + context.sender + " was successful. Thanks."
}



//view function(s)

//return number of registered houses
export function returnHouses():string {
    return "There are " + houses.length.toString() + " registered house(s).";
}

//get the details of a house via its idea
export function getDetailsByHouseId(houseId:u64):string {

    assert(houses.length != 0, "There is no house to get the details yet.")
    assert(houses.contains(houseId.toString()), "The house id that you entered does not exist, try again with different house id.")

    return houses.getSome(houseId.toString()).getDetails();
}