import {Component, Input, OnInit} from '@angular/core';
import {TicketsService} from '../../../../shared/services/tickets.service';
import {Ticket} from '../../../../shared/model/ticket';
import {UtilsService} from '../../../../shared/services/utils.service';
import {MessageService} from 'primeng/api';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MainCategory} from '../../../../shared/model/mainCategory';
import {Subcategory} from '../../../../shared/model/subcategory';
import {Topic} from '../../../../shared/model/topic';
import {MainCategoryService} from '../../../../shared/services/main-category.service';
import {SubCategoryService} from '../../../../shared/services/sub-category.service';
import {TopicService} from '../../../../shared/services/topic.service';
import {Type} from '../../../../shared/model/type';
import {Priority} from '../../../../shared/model/priority';
import {CustomerAccounts} from '../../../../shared/model/customerAccounts';
import {TicketHolder} from '../../../../shared/model/ticketHolder';
import {FileUploadService} from '../../../../shared/services/file-upload.service';
import {environment} from '../../../../../environments/environment';
import {BasicTopicSelection} from '../../../general/basic-topic-selection';
import {AccountServicesService} from '../../../../shared/services/account-services.service';
import {CustomerSearchContainer, SearchTicketsContainer} from '../../../../shared/model/searchTicketsContainer';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.scss'],
  providers: [MessageService]
})
export class CreateTicketComponent extends BasicTopicSelection implements OnInit {

  uploadURL: string = environment.apiUrl + 'upload/uploadMultipleFiles';
  ticket: Ticket = {};
  ticketHolder: TicketHolder = {};
  ticketForm: FormGroup;
  maxFileSize = 15000000;
  maxUploadFiles = 10;
  ticketTypeList: Type[];
  // channelList: Channel[];

  selectedMainCategory: MainCategory;
  selectedSubCategory: Subcategory;
  selectedTopic: Topic;
  selectedTicketType: Type;
  selectedPriority: Priority;
  accountsList: CustomerAccounts[];
  @Input() selectedAccount: CustomerAccounts;
  uploadedFiles: any[] = [];
  attachments: any[] = [];

  lockAfterSave = false;

  constructor(public utils: UtilsService,
              public ticketHttp: TicketsService,
              public messageService: MessageService,
              public mainCategoryService: MainCategoryService,
              public subCategoryService: SubCategoryService,
              public topicService: TopicService,
              public fb: FormBuilder, public fileUploadService: FileUploadService, private accountServices: AccountServicesService) {
    super(topicService, subCategoryService, mainCategoryService, utils);
    this.enableAdminSelection = false;
    this.authorizedTopicsRequest = {permissions: ['create']};
  }

  ngOnInit() {
    this.initTicketForm();
    this.initValueLists();
    if (this.selectedAccount != null) {
      this.ticketForm.value.CustomerBasic = this.selectedAccount.customerCIF;
      this.ticketForm.value.CustomerNameEn = this.selectedAccount.customerNameEn;
      this.ticketForm.value.CustomerNameAr = this.selectedAccount.customerNameAR;
      this.ticketForm.value.CustomerBranch = this.selectedAccount.branchName;
      this.ticketForm.value.CustomerMobile = this.selectedAccount.mobile;
      this.ticketForm.value.CustomerEmail = this.selectedAccount.email;
      this.ticketForm.value.CustomerSegment = this.selectedAccount.segment;
    }
  }

  initValueLists() {
    this.listAllMainCategories();
  }

  initTicketForm() {
    this.ticketForm = this.fb.group({
      'TicketID': new FormControl(''),
      'MainCategory': new FormControl(''),
      'SubCategory': new FormControl(''),
      'Topic': new FormControl('', Validators.required),
      'Subject': new FormControl('', Validators.required),
      'TicketType': new FormControl('', Validators.required),
      'Channel': new FormControl('', Validators.required),
      'Priority': new FormControl('', Validators.required),
      'Details': new FormControl('', Validators.required),
      'CustomerBasic': new FormControl(''),
      'CustomerNameEn': new FormControl(''),
      'CustomerNameAr': new FormControl(''),
      'CustomerMobile': new FormControl('', Validators.compose([Validators.pattern('[05][0-9]{9}')])),
      'CustomerSegment': new FormControl(''),
      'CustomerBranch': new FormControl(''),
      'CustomerEmail': new FormControl('', Validators.compose([Validators.email]))
    });
  }

  onChangeTopic() {
    if (this.selectedTopic != null && this.selectedTopic.id != null) {
      this.ticketForm.controls.Topic.setValue(this.selectedTopic);
    } else {
      this.ticketForm.controls.Topic.setValue(null);
    }
    this.ticketForm.controls.Topic.updateValueAndValidity();
  }

  onChangeType() {
    if (this.selectedTicketType != null && this.selectedTicketType.typeID != null) {
      this.ticketForm.controls.TicketType.setValue(this.selectedTicketType);
    } else {
      this.ticketForm.controls.TicketType.setValue(null);
    }
    this.ticketForm.controls.TicketType.updateValueAndValidity();
  }

  onChangePriority() {
    if (this.selectedPriority != null && this.selectedPriority.priorityValue != null) {
      this.ticketForm.controls.Priority.setValue(this.selectedPriority);
    } else {
      this.ticketForm.controls.Priority.setValue(null);
    }
    this.ticketForm.controls.Priority.updateValueAndValidity();
  }

  bindFormToTicket() {

    this.ticket.topic = this.selectedTopic;
    this.ticket.subject = this.ticketForm.value.Subject;
    this.ticket.ticketType = this.selectedTicketType.typeID;
    this.ticket.sourceChannel = this.ticketForm.value.Channel;
    this.ticket.priority = this.selectedPriority.priorityValue;
    this.ticket.details = this.ticketForm.value.Details;


    let customerAccount: CustomerAccounts = {};
    customerAccount.customerCIF = this.ticketForm.value.CustomerBasic;
    customerAccount.customerNameEn = this.ticketForm.value.CustomerNameEn;
    customerAccount.customerNameAR = this.ticketForm.value.CustomerNameAr;
    customerAccount.branchName = this.ticketForm.value.CustomerBranch;
    customerAccount.mobile = this.ticketForm.value.CustomerMobile;
    customerAccount.email = this.ticketForm.value.CustomerEmail;
    customerAccount.segment = this.ticketForm.value.CustomerSegment;

    if (this.selectedAccount != null) {
      customerAccount.id = this.selectedAccount.id;
    }

    this.ticket.customerAccount = customerAccount;
    this.ticketHolder.ticket = this.ticket;
    this.ticketHolder.customerAccount = customerAccount;
    this.ticketHolder.attachments = this.attachments[0];
  }

  reset() {
    console.log('Reset Ticket');
    this.lockAfterSave = false;
    this.ticketHolder = {};
    this.ticket = {};
    this.selectedMainCategory = {};
    this.subCategories = [];
    this.selectedSubCategory = {};
    this.topics = [];
    this.selectedTopic = {};
    this.ticketForm.reset();
    this.ticketForm.updateValueAndValidity();
    this.attachments = [];
    this.uploadedFiles = [];
  }

  SaveTicket() {
    console.log('Start Save Ticket');
    let self = this;
    this.bindFormToTicket();
    this.ticketHttp.create(this.ticketHolder).subscribe(returnedTicket => {
        this.messageService.add({severity: 'info', summary: 'Success', detail: 'Ticket Created Successfully'});
        this.ticketForm.controls.TicketID.setValue(returnedTicket.id);
        this.lockAfterSave = true;
      },
      error => {
        // can't create Ticket
        console.error('Creation Failed !' + error.error.msg);
        this.messageService.add({severity: 'error', summary: 'Failed', detail: error.error.msg});
        // this.display = true;

      });

    console.log('End Save Ticket');

  }

  onUploadFiles(event) {

    event.files.forEach(file => {
      this.uploadedFiles.push(file);
      console.log(JSON.stringify(this.uploadedFiles));
    });
    this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});

  }

  searchCustomer() {
    this.accountsList = [];
    const searchData: CustomerSearchContainer = {
      customerBasic: this.ticketForm.value.CustomerBasic, customerEmail: this.ticketForm.value.CustomerEmail
      , customerMobile: this.ticketForm.value.CustomerMobile
    };
    this.accountServices.search(searchData).subscribe(value => {
      this.accountsList = value;
    });

  }

  customUploader(events, uploadElement) {
    console.log(this.attachments.length + events.files.length);
    if (this.attachments.length > this.maxUploadFiles || (this.attachments.length + events.files.length) > this.maxUploadFiles) {
      this.messageService.add({severity: 'error', summary: 'File Upload Failed', detail: 'Maximum reached'});
      events.files = null;
      uploadElement.clear();
    } else {
      this.fileUploadService.uploadFiles(events.files).subscribe(value => {
        events.files.forEach(file => {
          this.uploadedFiles.push(file);
          console.log(JSON.stringify(this.uploadedFiles));
        });
        this.attachments.push(value);
        events.files = [];
        this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
        // console.log('attachments ' + this.attachments);
        uploadElement.clear();
      }, error1 => {
        this.messageService.add({severity: 'error', summary: 'File Upload Failed', detail: JSON.stringify(error1)});
      });
    }
  }
}
