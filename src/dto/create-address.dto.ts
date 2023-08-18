import { Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

class CreateAddressDto {

    @IsString()
    @IsNotEmpty()
    @Expose({ name: "address_line_1" })
    addressLine1: string;

    @IsString()
    @IsNotEmpty()
    @Expose({ name: "address_line_2" })
    addressLine2: string;

    @IsString()
    @IsNotEmpty()
    city: string

    @IsString()
    @IsNotEmpty()
    state: string

    @IsString()
    @IsNotEmpty()
    country: string

    @IsString()
    @IsNotEmpty()
    pincode: string;
}

export default CreateAddressDto;