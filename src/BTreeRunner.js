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

  async fetchTree(pageNumber) {
    const pages = await this.fetchFullTreeRec(pageNumber);
    if (Array.isArray(pages)) {
      return [].concat(...pages);
    }
    return [pages];
  }

  async fetchFullTreeRec(pageNumber) {
    const page = await this._pager.loadPage(pageNumber);
    if (page.type === PageHeader.TYPE.INTERIOR_TABLE) {
      return Promise.all(page.getPointers().map(([, pointer]) => this.fetchFullTreeRec(pointer)));
    }
    return page;
  }
};

export default BTree;
