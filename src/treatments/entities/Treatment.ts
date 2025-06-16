import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('treatments' )
export class Treatment  {
 
  @PrimaryGeneratedColumn()
  id_treatments: number;

  @Column()
  name_treatments: string;

  @Column()
  type_treatments: string;

  @Column()
  duration_treatments: number;

  @Column()
  price_treatments: number;

 /* @Column()
  visible_to_patients_treatments: boolean;*/

  @Column({default:true})
  is_active_treatments: boolean;
  
 

constructor(

  id_treatments: number,
  name_treatments: string,
  type_treatments: string,
  duration_treatments: number,
  price_treatments: number,
  /*visible_to_patients_treatments: boolean,*/
  is_active_treatments: boolean
){
  this.id_treatments = id_treatments;
  this.name_treatments = name_treatments;
  this.type_treatments = type_treatments;
  this.duration_treatments = duration_treatments;
  this.price_treatments = price_treatments;
  /*this.visible_to_patients_treatments = visible_to_patients_treatments;*/
  this.is_active_treatments = is_active_treatments;
}

}