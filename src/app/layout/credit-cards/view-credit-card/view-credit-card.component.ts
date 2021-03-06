import {Component, Input, OnInit} from '@angular/core';
import {CreditCard} from "../../../shared/model/CreditCard";

@Component({
  selector: 'app-view-credit-card',
  templateUrl: './view-credit-card.component.html',
  styleUrls: ['./view-credit-card.component.scss']
})
export class ViewCreditCardComponent implements OnInit {

  @Input() creditCardList:CreditCard[];
  display:boolean = false;
  selectedCreditCard:CreditCard ={};
  constructor() {

    this.selectedCreditCard.creditCardClass = {};
    this.selectedCreditCard.creditCardClass.rewardInfo = {};
  }

  ngOnInit() {
  }

  showCreditCardDetails(creditCard:CreditCard){
    this.display = true;
    this.selectedCreditCard = creditCard;
  }

}
