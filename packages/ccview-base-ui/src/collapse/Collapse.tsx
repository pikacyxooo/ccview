import { ref, defineComponent, getCurrentInstance, provide, reactive, ComponentInternalInstance, ComponentPublicInstance, VNodeNormalizedChildren, VNode, isVNode, PropType } from 'vue';

export const COLLAPSE_KEY = Symbol('collapse');

export type Numeric = number | string;

const collapseProps = {
    modelValue: {
        type: Array as PropType<Numeric[]>,
        default: []
    }
}

export function flattenVNodes(children: VNodeNormalizedChildren) {
  const result: VNode[] = [];

  const traverse = (children: VNodeNormalizedChildren) => {
    if (Array.isArray(children)) {
      children.forEach((child) => {
        if (isVNode(child)) {
          result.push(child);

          if (child.component?.subTree) {
            result.push(child.component.subTree);
            traverse(child.component.subTree.children);
          }

          if (child.children) {
            traverse(child.children);
          }
        }
      });
    }
  };

  traverse(children);

  return result;
}

// sort children instances by vnodes order
export function sortChildren(
    parent: ComponentInternalInstance,
    publicChildren: ComponentPublicInstance[],
    internalChildren: ComponentInternalInstance[]
  ) {
    const vnodes = flattenVNodes(parent.subTree.children);
  
    internalChildren.sort(
      (a, b) => vnodes.indexOf(a.vnode) - vnodes.indexOf(b.vnode)
    );
  
    const orderedPublicChildren = internalChildren.map((item) => item.proxy!);
  
    publicChildren.sort((a, b) => {
      const indexA = orderedPublicChildren.indexOf(a);
      const indexB = orderedPublicChildren.indexOf(b);
      return indexA - indexB;
    });
  }

export default defineComponent({
    props: collapseProps,
    emits: ['update:modelValue'],
    setup(props, { emit, slots }) {
        const publicChildren: ComponentPublicInstance[] =  reactive([]);
        const internalChildren: ComponentInternalInstance[] = reactive([]);
        const parent = getCurrentInstance()!;

       
        const link = (child: ComponentInternalInstance) => {
            // console.log(child)
            if(child.proxy) {
                internalChildren.push(child)
                publicChildren.push(child.proxy as ComponentPublicInstance)
                sortChildren(parent, publicChildren, internalChildren);
            }
        }

        const unlink = (child: ComponentInternalInstance) => {
            const index = internalChildren.indexOf(child)
            publicChildren.splice(index, 1)
            internalChildren.splice(index, 1)
        }

        const isExpanded = (name: Numeric) => {
            const { modelValue } = props;
            return modelValue.includes(name);
        }

        const updateName = (name: Numeric | Numeric[]) => {
            emit('update:modelValue', name);
        };

        const toggle = (index: Numeric, expanded: boolean) => {
            let { modelValue } = props;
            console.log(expanded, modelValue)
            if(expanded) {
                updateName((modelValue as Numeric[]).filter(item => item !== index))
            } else {
                updateName((modelValue as Numeric[]).concat(index))
            }
        }

        provide(COLLAPSE_KEY, {
            parent,
            internalChildren,
            isExpanded,
            link,
            unlink,
            toggle,
        })

        return () => (
            <div class="ccview-collapse">
                {slots.default?.()}
            </div>
        )
    }
})