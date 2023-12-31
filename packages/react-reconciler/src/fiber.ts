import { Props, Key, Ref, ReactElement } from "shared/ReactTypes"
import { Fragment, FunctionComponent, HostComponent, WorkTag } from "./workTags"
import { Flags, NoFlags } from "./fiberFlags"
import { Container } from "hostConfig"
import { Lane, Lanes, NoLane } from "./fiberLanes"
export class FiberNode {
  type: any
  tag: WorkTag
  pendingProps: Props
  key: Key
  ref: Ref
  stateNode: any
  return: FiberNode | null
  sibling: FiberNode | null
  child: FiberNode | null
  index: number
  memoizedProps: Props | null
  memoizedState: Props | null
  alternate: FiberNode | null
  flags: Flags
  subtreeFlags: Flags
  updateQueue: unknown
  deletions: FiberNode[] | null

  constructor(tag: WorkTag, pendingProps: Props, key: Key) {
    this.tag = tag
    this.key = key
    this.stateNode = null
    this.type = null
    // 构建树状结构
    this.return = null
    this.sibling = null
    this.child = null
    this.index = 0

    this.ref = null

    // 工作单元
    this.pendingProps = pendingProps
    this.memoizedProps = null
    this.memoizedState = null
    this.updateQueue = null

    this.alternate = null
    // 副作用
    this.flags = NoFlags
    this.subtreeFlags = NoFlags
    this.deletions = null
    
  }
}

export class FiberRootNode {
  container: Container
  current: FiberNode
  finishedWork: FiberNode | null
  pendingLanes: Lanes
  finishedLane: Lane
  constructor(container: Container, hostRootFiber: FiberNode) {
    this.container = container
    this.current = hostRootFiber
    hostRootFiber.stateNode = this
    this.finishedWork = null
    this.pendingLanes = NoLane
    this.finishedLane = NoLane
  }
}

export const createWorkInProgress = (
  current: FiberNode,
  pendingProps: Props
): FiberNode => {
  let wip = current.alternate
  if (wip === null) {
    // mount
    wip = new FiberNode(current.tag, pendingProps, current.key)
    wip.stateNode = current.stateNode

    wip.alternate = current
    current.alternate = wip
  } else {
    // update
    wip.pendingProps = pendingProps
    wip.flags = NoFlags
    wip.subtreeFlags = NoFlags
    wip.deletions = null
  }
  wip.type = current.type
  wip.updateQueue = current.updateQueue
  wip.child = current.child
  wip.memoizedProps = current.memoizedProps
  wip.memoizedState = current.memoizedState
  return wip
}

export function createFiberFromElement(element: ReactElement) {
  const { type, props, key } = element
  let fiberTag: WorkTag = FunctionComponent

  if (typeof type === 'string') {
    fiberTag = HostComponent
  } else if (typeof type !== 'function') {
    console.warn('未定义的type类型', type)
  }

  const fiber = new FiberNode(fiberTag, props, key)
  fiber.type = type
  return fiber
}

export function createFiberFromFragment(elements: any[], key: Key) {
  const fiber = new FiberNode(Fragment, elements, key)
  return fiber
}
