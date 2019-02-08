/*
*
* SQLite query processor
* Karolinska Institutet, 2019
*
* Matthias Stahl
*/

/* eslint-disable no-underscore-dangle */
import PageHeader from './PageHeader';


const BTree = class {
  constructor(pager) {
    this._pager = pager;
  }

  async fetchFullIndex(pageNumber) {
    const page = await this._pager.loadPage(pageNumber);
    if (page.type === PageHeader.TYPE.INTERIOR_INDEX) {
      return Promise.all(page.getPointers().map(pointer => this.fetchFullIndex(pointer)));
    }
    return page;
  }

  async fetchFullTable(pageNumber) {
    const page = await this._pager.loadPage(pageNumber);
    if (page.type === PageHeader.TYPE.INTERIOR_TABLE) {
      return Promise.all(page.getPointers().map(pointer => this.fetchFullTable(pointer)));
    }
    return page;
  }
};

export default BTree;
