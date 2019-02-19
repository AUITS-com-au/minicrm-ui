import {MainCategory} from '../../shared/model/mainCategory';
import {Subcategory} from '../../shared/model/subcategory';
import {Topic} from '../../shared/model/topic';
import {MainCategoryService} from '../../shared/services/main-category.service';
import {SubCategoryService} from '../../shared/services/sub-category.service';
import {TopicService} from '../../shared/services/topic.service';
import {UtilsService} from '../../shared/services/utils.service';
import {Input} from '@angular/core';
import {GetAuthorizedTopicsRequest} from '../../shared/model/get-authorized-topics-request';
import {SelectItem} from 'primeng/api';

export class BasicTopicSelection {

  constructor(public topicService: TopicService
    , public subCategoryService: SubCategoryService,
              public mainCatService: MainCategoryService, public utils: UtilsService) {
  }

  @Input() public mainCategories: MainCategory[] = [];
  public mainCategoriesSelectItems: SelectItem[] = [];
  @Input() public selectedMainCategory: MainCategory;
  @Input() public subCategories: Subcategory[] = [];
  public subCategoriesSelectItems: SelectItem[] = [];
  @Input() public selectedSubCategory: Subcategory;
  @Input() public topics: Topic[] = [];
  public topicsSelectItems: SelectItem[] = [];
  @Input() public selectedTopic: Topic;

  @Input() public enableAdminSelection: Boolean = true;
  @Input() public authorizedTopicsRequest: GetAuthorizedTopicsRequest = {permissions: ['read']};

  public updateTopicList() {
    if (!this.enableAdminSelection) {
      if (this.selectedSubCategory != null && this.selectedSubCategory.id != null) {
        this.authorizedTopicsRequest.subCat = this.selectedSubCategory.id;
        this.topicService.authorized(this.authorizedTopicsRequest).subscribe(
          result => {
            const topic: Topic = {id: null, arabicLabel: 'اختر الموضوع', englishLabel: 'Select Topic'};
            this.topics = result;
            this.topics.unshift(topic);
          }
        );
      } else {
        this.topics = [];
        this.selectedTopic = null;
      }
    } else {
      if (this.selectedSubCategory != null && this.selectedSubCategory.id != null) {

        this.topicService.active(this.selectedSubCategory.id).subscribe(
          result => {
            const topic: Topic = {id: null, arabicLabel: 'اختر الموضوع', englishLabel: 'Select Topic'};
            this.topics = result;
            this.topics.unshift(topic);
            this.buildTopicSelectItems();
          }
        );

      } else {
        this.topics = [];
        this.selectedTopic = null;
        this.buildTopicSelectItems();
      }
    }


  }

  private buildTopicSelectItems() {
    if (this.topics != null) {
      this.topicsSelectItems = [];
      this.topics.forEach(value => {
        const selectItem: SelectItem = {label: value[this.utils.getLabelNameLoc(value)], value: value};
        this.topicsSelectItems.push(selectItem);
      });
    }
  }

  public updateSubCategory() {
    if (!this.enableAdminSelection) {
      if (this.selectedMainCategory != null && this.selectedMainCategory.id != null) {
        this.authorizedTopicsRequest.mainCat = this.selectedMainCategory.id;

        console.log('Request ' + JSON.stringify(this.authorizedTopicsRequest));
        this.subCategoryService.authorized(this.authorizedTopicsRequest).subscribe(
          result => {
            this.subCategories = result;
            const subcategory: Subcategory = {arabicLabel: 'اختر التصنيف الفرعي', englishLabel: 'Select Sub Category', id: null};
            this.subCategories.unshift(subcategory);
            this.buildSubcategoriesSelectItems();
          }
        );
      } else {
        this.topics = [];
        this.selectedTopic = null;
        this.selectedSubCategory = null;
        this.subCategories = [];
        this.topicsSelectItems = [];
      }
    } else {
      if (this.selectedMainCategory != null && this.selectedMainCategory.id != null) {
        this.subCategoryService.active(this.selectedMainCategory.id).subscribe(
          result => {
            this.subCategories = result;
            const subcategory: Subcategory = {englishLabel: 'Select Sub Category', arabicLabel: 'اختر التصنيف الفرعي', id: null};
            this.subCategories.unshift(subcategory);
            this.buildSubcategoriesSelectItems();
          }
        );
      } else {
        this.topics = [];
        this.topicsSelectItems = [];
        this.selectedTopic = null;
        this.selectedSubCategory = null;
        this.subCategories = [];

      }
    }

  }

  private buildSubcategoriesSelectItems() {
    if (this.subCategories != null) {
      this.subCategoriesSelectItems = [];
      this.subCategories.forEach(value => {
        const selectItem: SelectItem = {label: value[this.utils.getLabelNameLoc(value)], value: value};
        this.subCategoriesSelectItems.push(selectItem);
      });
    }
  }

  public listAllMainCategories() {
    if (!this.enableAdminSelection) {
      this.mainCatService.authorized(this.authorizedTopicsRequest).subscribe(
        result => {
          const mainCat: MainCategory = {id: null, arabicLabel: 'اختر القسم الرئيسي', englishLabel: 'Select Main Category'};
          this.mainCategories = result;
          this.mainCategories.unshift(mainCat);
          this.buildMainCategoriesSelectItems();
        }, error1 => {

        }
      );
    } else {
      this.mainCatService.active().subscribe(
        result => {
          const mainCat: MainCategory = {id: null, arabicLabel: 'اختر القسم الرئيسي', englishLabel: 'Select Main Category'};
          this.mainCategories = result;
          this.mainCategories.unshift(mainCat);
          this.buildMainCategoriesSelectItems();
        }, error1 => {

        }
      );
    }


  }

  private buildMainCategoriesSelectItems() {
    if (this.mainCategories != null) {
      this.mainCategoriesSelectItems = [];
      this.mainCategories.forEach(value => {
        const selectItem: SelectItem = {label: value[this.utils.getLabelNameLoc(value)], value: value};
        this.mainCategoriesSelectItems.push(selectItem);
      });
    }
  }


}
