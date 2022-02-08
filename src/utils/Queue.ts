class CustomQueueNode {
  public value: any
  public next: CustomQueueNode | null
  constructor(value: string) {
    this.value = value
    this.next = null
  }
}

class MyQueue {
  private head: CustomQueueNode | null
  private back: CustomQueueNode | null
  constructor() {
    this.head = null
    this.back = null
  }

  isEmpty() {
    return !this.head
  }

  enqueue(value: any) {
    let node = new CustomQueueNode(value)

    if (this.isEmpty()) {
      this.back = node
      this.head = node
    } else {
      ;(this.back as CustomQueueNode).next = node
      this.back = node
    }
  }

  dequeue() {
    let node = this.head
    if (!this.isEmpty()) {
      this.head = (this.head as CustomQueueNode).next
    }
    return node
  }
}

export default MyQueue
