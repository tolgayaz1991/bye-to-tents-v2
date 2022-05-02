import { context, PersistentUnorderedMap, logging, storage, u128, ContractPromiseBatch } from "near-sdk-as";


// House class
@nearBindgen
export class House {
	houseId: string;
	initiator: string;
	fundNeed: u128; //in yoctoNears
	fundCollected: u128; //in yoctoNears
	isCompleted: bool;
	donators: PersistentUnorderedMap<string, u128>;  //to be used in later versions

	constructor(
				public _houseId:string,
				public _initiator:string,
				public _fundNeed:u128
				)
				{
					assert(_fundNeed >= u128.Zero,"Fund need should at least be 0 Near.")
					this.houseId = _houseId;
					this.initiator = _initiator;
					this.fundNeed = _fundNeed;
					this.fundCollected = u128.fromString("0");
					this.isCompleted = false;
					this.donators = new PersistentUnorderedMap<string,u128>(_houseId);
					logging.log("The house was registered by "+ this.initiator + " with id(note the id please): " + this.houseId +". The fund needed for this house is "+ (this.fundNeed.toF64()/10**24).toString() + " Near.");
				}
	
	// change method(s)

	//donate to this house
	donate(): void {

			assert(!(this.isCompleted), "Donation is unsuccessful. Funding for this house was completed. Try to donate to another house.");
			let amountInNear = context.attachedDeposit.toF64()/10**24;
			assert(u128.add(this.fundCollected, context.attachedDeposit) <= this.fundNeed, "Donation is unsuccessful. You can donate at most " + (u128.sub(this.fundNeed,this.fundCollected)).toString() + " Near for this house.");
			
			this.fundCollected = u128.add(this.fundCollected, context.attachedDeposit);
			ContractPromiseBatch.create(this.initiator).transfer(context.attachedDeposit);
			logging.log(amountInNear.toString() + " Near was donated successfully by " + context.sender + " to the house with id " + this.houseId + ". Thanks.");
            
            if (this.fundCollected == this.fundNeed) {
                this.isCompleted = true;
                logging.log("All of the required fund "+ (this.fundNeed.toF64()/10**24).toString() +" Near was collected for this house with id " + this.houseId.toString()+ ". Thanks.")
            }
		}



	// view method(s)

	//view the details about this house's funding situation
	getDetails(): string {
		if (!this.isCompleted){
			return "Collected fund for this house (with id " + this.houseId.toString() +"): " + (this.fundCollected.toF64()/10**24).toString() + " Near" + "    ----->    " + "Remaining fund need: " +((u128.sub(this.fundNeed, this.fundCollected)).toF64()/10**24).toString() + " Near."; }
		else {
			return "All of the required fund "+ (this.fundNeed.toF64()/10**24).toString() +" Near was collected for this house with id " + this.houseId.toString() + ". Thanks.";
		}
	}
}


// houses Mapping

export const houses = new PersistentUnorderedMap<string,House>("h");