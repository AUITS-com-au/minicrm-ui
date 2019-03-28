import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Account} from "../model/Account";
import {stripGeneratedFileSuffix} from "@angular/compiler/src/aot/util";
import {AccountList} from "../model/AccountList";
import {CustomerAccount} from "../model/CustomerAccount";
import {AccountTransactionsRequest} from "../model/AccountTransactionsRequest";
import {AccountTransactionsResponse} from "../model/AccountTransactionsResponse";

@Injectable({
  providedIn: 'root'
})
export class MWAccountService {

  private baseURL: string = environment.apiUrl + 'ws/account/';

  constructor(private httpClient: HttpClient) {
  }

  getCustomerAccounts(customerBasic: string, segment: string, idNumber: string, lang: string) {
    return this.httpClient.get<CustomerAccount>(this.baseURL + 'accountList/' + customerBasic + "/" + segment + "/" + idNumber + "/" + lang);
  }

  getAccountTransactions(accountTransactionsRequest : AccountTransactionsRequest){
    return this.httpClient.post<AccountTransactionsResponse>(this.baseURL + 'accountTransactions',accountTransactionsRequest);

  }

}