import { Component, OnInit, Inject, HostListener, ElementRef, ViewContainerRef, ViewChildren, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { debounce } from "@agentepsilon/decko";
import { DOCUMENT } from "@angular/common";
import { cloneDeep, max, findIndex } from "lodash";
import * as moment from 'moment';

import { EditCardComponent } from '../edit-card/edit-card.component';
import { CommonService } from '../../../core-services/common.service';
import { ApiService } from '../../../core-services/api.service';

@Component({
  selector: 'app-nested-planner',
  templateUrl: './nested-planner.component.html',
  styleUrls: ['./nested-planner.component.scss']
})
export class NestedPlannerComponent implements OnInit {

  boards: any = {
    talks: []
  };

  cardSchema: any = {
    title: "",
    description: "",
    author: '',
    image: '',
    tags: [],
    status: 'ToDo',
    untouched: true,
    createdAt: '',
    selectedDate: [new Date(), new Date()],
    color: '',
    talks: []
  };

  cardConfig = [
    {
      cardType: 'Epic',
      color: 'blue'
    }, {
      cardType: 'Release',
      color: 'yellow'
    }
  ];


  cards: any;
  cardList: any[] = [];
  boardId: string;
  innerWidth: any;
  innerHeight: any;
  isLoading: boolean = true;
  heightOffset: number = 65;

  dropTargetIds = [];
  nodeLookup = {};
  dropActionTodo = null;

  cardHolder: any[] = [];
  cardHolderCount: number = 0;
  cardHolderHeight: number | string = '160px';

  disableNewCard: boolean = true;
  createCard: FormGroup;
  createCardLoading: boolean = false;
  @ViewChildren('addCardInput') textarea: any;
  containerScroll: any;
  // @ViewChildren('containerScroll') containerScroll: any;

  constructor(@Inject(DOCUMENT) private document: Document, private fb: FormBuilder, private renderer: Renderer2, private el: ElementRef, private router: Router, private route: ActivatedRoute, private commonService: CommonService, private modal: NzModalService, private viewContainerRef: ViewContainerRef, private boardAPI: ApiService) {
    this.commonService.setHeaderStore(true);
  }

  prepareDragDrop(nodes: any[]) {
    nodes.forEach(node => {
      this.dropTargetIds.push(node.id);
      this.nodeLookup[node.id] = node;
      this.prepareDragDrop(node.talks);
    });
  }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    this.cards = this.cardConfig.map((card) => {
      return { ...this.cardSchema, cardType: card.cardType, color: card.color };
    });

    this.boardId = localStorage.getItem('boardId');
    this.createCard = this.fb.group({
      cardName: ['', [Validators.required]],
    });
    this.listCards();
  }

  addNewCard(event, card) {
    event.stopPropagation();
    this.createCardLoading = true;
    Object.assign(card, { title: this.createCard.value.cardName });

    this.boardAPI.createCard(card).subscribe((response: any) => {
      this.disableNewCard = true;
      this.createCardLoading = false;
      Object.assign(card, response);
      Object.assign(card, { untouched: false, id: response._id });
      this.createCard.setValue({
        cardName: ''
      });
      this.prepareDragDrop(this.boards.talks);
    },
      (error) => {
        this.disableNewCard = true;
        this.createCardLoading = false;
        this.boardAPI.notification();
      });
  }

  cancelCard(cardList) {
    this.disableNewCard = true;
    const index = cardList.length - 1;
    cardList.splice(index, 1);
    this.createCard.setValue({
      cardName: ''
    });
    this.getCardHolder();
    this.getHeight();
  }

  @debounce(8)
  dragMoved(event) {
    let e = this.document.elementFromPoint(event.pointerPosition.x, event.pointerPosition.y);

    if (!e) {
      this.clearDragInfo();
      return;
    }
    let container = e.classList.contains("node-item") ? e : e.closest(".node-item");
    if (!container) {
      this.clearDragInfo();
      return;
    }
    this.dropActionTodo = {
      targetId: container.getAttribute("data-id")
    };
    const targetRect = container.getBoundingClientRect();
    const oneThird = targetRect.height / 2.4;

    if (event.pointerPosition.y - targetRect.top < oneThird) {
      // before
      this.dropActionTodo["action"] = "before";
    } else if (event.pointerPosition.y - targetRect.top > 2 * oneThird) {
      // after
      this.dropActionTodo["action"] = "after";
    } else {
      // inside
      this.dropActionTodo["action"] = "inside";
    }
    this.showDragInfo();
  }


  drop(event) {
    if (!this.dropActionTodo) return;

    const draggedItemId = event.item.data;
    const parentItemId = event.previousContainer.id;
    const targetListId = this.getParentNodeId(this.dropActionTodo.targetId, this.boards.talks, 'main');

    const draggedItem = this.nodeLookup[draggedItemId];
    const oldItemContainer = parentItemId != 'main' ? this.nodeLookup[parentItemId].talks : this.boards.talks;
    const newContainer = targetListId != 'main' ? this.nodeLookup[targetListId].talks : this.boards.talks;

    let i = oldItemContainer.findIndex(c => c.id === draggedItemId);
    oldItemContainer.splice(i, 1);

    switch (this.dropActionTodo.action) {
      case 'before':
      case 'after':
        draggedItem.parentId = this.nodeLookup[this.dropActionTodo.targetId].parentId;
        const targetOrder = this.nodeLookup[this.dropActionTodo.targetId].order;
        //const draggedOrder = draggedItem.order;
        draggedItem.order = targetOrder;
        draggedItem.level = this.nodeLookup[this.dropActionTodo.targetId].level;
        this.nodeLookup[this.dropActionTodo.targetId].order = -1;

        const targetIndex = newContainer.findIndex(c => c.id === this.dropActionTodo.targetId);
        if (this.dropActionTodo.action == 'before') {
          newContainer.splice(targetIndex, 0, draggedItem);
        } else {
          newContainer.splice(targetIndex + 1, 0, draggedItem);
        }

        const startIndex = findIndex(newContainer, ['order', -1]);
        newContainer.slice(startIndex).forEach((card, index) => {
          card.order = draggedItem.order + 1 + index;
        })
        const updatePosition = {
          cards: newContainer
        }
        setTimeout(() => {
          this.clearDragInfo(true);
          this.getCardHolder();
          this.getHeight();
          this.prepareDragDrop(this.boards.talks);
          this.boardAPI.reorder(updatePosition).subscribe((response) => {
            console.log(response)
          },
            (error) => {
              console.log(error)
              this.boardAPI.notification()
            })
        }, 200);
        break;

      case 'inside':
        draggedItem.parentId = this.nodeLookup[this.dropActionTodo.targetId].id;
        draggedItem.order = this.nodeLookup[this.dropActionTodo.targetId].talks.length;
        draggedItem.level = this.nodeLookup[this.dropActionTodo.targetId].level + 1;

        this.nodeLookup[this.dropActionTodo.targetId].talks.push(draggedItem)
        setTimeout(() => {
          this.clearDragInfo(true);
          this.getCardHolder();
          this.getHeight();
          this.prepareDragDrop(this.boards.talks);
          this.boardAPI.editCard(draggedItem).subscribe((response) => {
          },
            (error) => {
              this.boardAPI.notification()
            })
        }, 200);
        break;
    }

  }

  getParentNodeId(id: string, nodesToSearch: any[], parentId: string) {
    for (let node of nodesToSearch) {
      if (node.id == id) return parentId;
      let ret = this.getParentNodeId(id, node.talks, node.id);
      if (ret) return ret;
    }
    return null;
  }

  showDragInfo() {
    this.clearDragInfo();

    if (this.dropActionTodo && this.dropActionTodo.targetId) {
      this.document.getElementById("node-" + this.dropActionTodo.targetId).classList.add("drop-" + this.dropActionTodo.action);
    }
  }

  clearDragInfo(dropped = false) {
    if (dropped) {
      this.dropActionTodo = null;
    }
    this.document
      .querySelectorAll(".drop-before")
      .forEach(element => element.classList.remove("drop-before"));
    this.document
      .querySelectorAll(".drop-after")
      .forEach(element => element.classList.remove("drop-after"));
    this.document
      .querySelectorAll(".drop-inside")
      .forEach(element => element.classList.remove("drop-inside"));

    this.getCardHolder();
    this.getHeight();
  }

  listCards() {
    this.isLoading = true;
    this.boardAPI.getCards(this.boardId).subscribe((response) => {
      this.isLoading = false;
      this.boards.talks = this.arrangeCards(response);
      this.getCardHolder();
      setTimeout(() => {
        this.getHeight();
        this.prepareDragDrop(this.boards.talks);
      }, 200)
    },
      (error) => {
        this.isLoading = false;
        this.boardAPI.notification();
      })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
  }

  newCard(card) {
    let newCard = cloneDeep(this.cards[0]);
    newCard.boradId = this.boardId;
    newCard.id = this.generateGuid();
    newCard.parentId = null;
    newCard.order = this.boards.talks.length;
    newCard.level = 1;
    card.talks.push(newCard);
    this.getCardHolder();
    this.getHeight();
    this.disableNewCard = false;
    setTimeout(() => {
      this.textarea.first.nativeElement.focus();
    }, 5);
    // this.prepareDragDrop(this.boards.talks);
  }

  addCard(event, card, parentCard, index) {
    event.stopPropagation();
    let newCard = cloneDeep(this.cards[1]);
    newCard.boradId = this.boardId;
    newCard.id = this.generateGuid();
    newCard.order = parentCard[index].talks.length;
    newCard.parentId = parentCard[index]['_id'];
    newCard.level = parentCard[index]['level'] + 1;
    if (card.talks) card.talks.push(newCard);
    if (!card.talks) card.talks = [newCard];
    this.getCardHolder();
    this.getHeight();
    setTimeout(() => {
      this.textarea.first.nativeElement.focus();
    }, 5);
    // this.prepareDragDrop(this.boards.talks);
    // this.boardAPI.createCard(newCard).subscribe((response) => {
    //   Object.assign(newCard, response)
    //   this.boardAPI.notification("Cards created successfully");
    // },
    //   (error) => {
    //     this.boardAPI.notification();
    //   });
  }

  editCard(event, card, talks, index) {
    event.stopPropagation();
    const modal = this.modal.create({
      nzContent: EditCardComponent,
      nzComponentParams: {
        card,
      },
      nzStyle: { width: "750px", top: "40px" },
      nzBodyStyle: { height: "75vh" }
    });
    modal.afterClose.subscribe((newCardData) => {
      if (newCardData == 'deleted') {
        talks.splice(index, 1);
        this.getCardHolder();
        this.getHeight();
        return;
      }
      Object.assign(card, newCardData);
    });
  }

  deleteCard(event, card, talks, index) {
    event.stopPropagation();
    if (card) {
      talks.splice(index, 1);
      this.getCardHolder();
      this.getHeight();
    }
  }

  inlineEditHolder(holderName, index) {
    this.cardHolder[index] = holderName
    const updateHolder = {
      boradId: this.boardId,
      cardHolder: this.cardHolder
    }
    localStorage.setItem('cardHolder', JSON.stringify(this.cardHolder));
    this.boardAPI.editCardHolder(updateHolder).subscribe((response) => {
    },
      (error) => {
        this.boardAPI.notification();
      })
  }

  arrangeCards(cards) {
    let map = {}, node, roots = [], i;
    for (i = 0; i < cards.length; i += 1) {
      cards[i].id = cards[i]._id;
      map[cards[i]._id] = i; // initialize the map
      cards[i].talks = []; // initialize the talks
    }
    for (i = 0; i < cards.length; i += 1) {
      node = cards[i];
      if (node.parentId != null) {
        // if you have dangling branches check that map[node.parentId] exists
        if (cards[map[node.parentId]]) cards[map[node.parentId]].talks.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }

  getCardHolder() {
    const cards = this.destructor(this.boards.talks);
    if (cards.length == 0) {
      this.cardHolderCount = 0;
      this.cardHolder = [];
      return;
    }
    let maxValue = max(cards.map((card) => {
      return card.length
    }));
    this.cardHolderCount = maxValue;
    let maxLevel = cards.filter((card) => {
      return card.length == maxValue
    });
    const holderNames = localStorage.getItem('cardHolder') ? JSON.parse(localStorage.getItem('cardHolder')) : [];
    this.cardHolder = maxLevel[0].map((max, index) => {
      return holderNames[index] ? holderNames[index] : "Column " + (index + 1);
    })
  }

  getByID(board, id) {
    let result = null
    if (id === board.id) {
      return board
    } else {
      if (board.talks) {
        board.talks.some(card => result = this.getByID(card, id));
      }
      return result;
    }
  }

  goBack() {
    this.router.navigateByUrl('/boards');
  }

  export() {
    console.log(this.boards.talks)
  }

  traverse(board, path = [], result = []) {
    if (!board.talks.length)
      if (board._id) result.push(path.concat(board));
    for (const child of board.talks)
      this.traverse(child, path.concat(board), result);
    return result;
  }

  destructor(boards) {
    let result = [];
    let flat = (data, prev = '') => {
      if (Array.isArray(data)) {
        data.forEach(e => flat(e, prev))
      } else {
        prev = prev + (prev.length ? '.' : '') + data.level;
        if (!data.talks.length) result.push(prev.split('.').map(Number))
        else flat(data.talks, prev)
      }
    }
    flat(boards);
    return result;
  }

  generateGuid() {
    let result, i, j;
    result = '';
    for (j = 0; j < 32; j++) {
      if (j == 8 || j == 12 || j == 16 || j == 20)
        result = result + '-';
      i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
      result = result + i;
    }
    return result;
  }

  getHeight() {
    const height = this.document.getElementById("main").clientHeight;
    if (height) {
      this.cardHolderHeight = (160 + height) + 'px';
    }
  }
}
