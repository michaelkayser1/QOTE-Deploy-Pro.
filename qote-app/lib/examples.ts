import { ArchitectureExample } from './types';

export const healthyV0Architecture: ArchitectureExample = {
  name: 'v0 Dashboard Generator (Healthy)',
  domains: [
    {
      id: 'prompt',
      title: 'Prompt Domain',
      subtitle: 'The Input Lens',
      coherenceRules: [
        'Parse natural language',
        'Maintain conversation context',
        'Extract UI component entities',
        'Resolve ambiguities from history'
      ],
      currentState: {
        description: 'Processing user intent',
        visual: 'Create a dark dashboard with metrics chart'
      },
      exportFormat: {
        type: 'json',
        content: `{
  "style": "dark",
  "components": ["MetricCard", "DataTable"],
  "libraries": ["recharts"]
}`
      }
    },
    {
      id: 'generation',
      title: 'Generation Domain',
      subtitle: 'The Code Lens',
      coherenceRules: [
        'React hooks patterns',
        'TypeScript type safety',
        'Shadcn/ui conventions',
        'Tailwind class merging'
      ],
      currentState: {
        description: 'Generating component code',
        visual: 'Generating <DataTable> with useReactTable...'
      },
      exportFormat: {
        type: 'json',
        content: `{
  "type": "DataTable",
  "props": {
    "data": "users",
    "columns": [...]
  }
}`
      }
    },
    {
      id: 'preview',
      title: 'Preview Domain',
      subtitle: 'The Render Lens',
      coherenceRules: [
        'Browser DOM management',
        'CSS rendering engine',
        'Iframe security sandbox',
        'Event bubbling control'
      ],
      currentState: {
        description: 'Rendering live UI',
        visual: 'Rendering live interactive UI...'
      },
      exportFormat: {
        type: 'text',
        content: '["click.column.email", "input.search.gmail"]'
      }
    },
    {
      id: 'feedback',
      title: 'Learning Curvature',
      subtitle: 'Intent Refinement',
      coherenceRules: [
        'Interprets user interactions',
        'Translates DOM events → Intent',
        'Refines specification',
        'Closes the learning loop'
      ],
      currentState: {
        description: 'Analyzing user behavior',
        visual: 'User clicked email header, typed "gmail"'
      },
      exportFormat: {
        type: 'text',
        content: 'Add email sorting + Gmail filter'
      }
    }
  ],
  hinges: [
    {
      id: 'hinge1',
      fromDomain: 'prompt',
      toDomain: 'generation',
      label: 'Intent → Recipe',
      icon: '🔄',
      rotationType: 'Functional → Grammatical',
      constraint: 'Resolved intent objects only',
      transformation: {
        before: 'I want a table',
        after: 'Generate <DataTable> with useReactTable hook'
      }
    },
    {
      id: 'hinge2',
      fromDomain: 'generation',
      toDomain: 'preview',
      label: 'Code → Instance',
      icon: '🎨',
      rotationType: 'Logical → Visual',
      constraint: 'Component tree schema only',
      transformation: {
        before: '{ type: "DataTable", props: {...} }',
        after: 'Rendered interactive table'
      }
    },
    {
      id: 'hinge3',
      fromDomain: 'preview',
      toDomain: 'prompt',
      label: 'Interaction → Intent',
      icon: '🔁',
      rotationType: 'Events → Specification',
      constraint: 'High-level intent stream only',
      transformation: {
        before: 'click, type, scroll events',
        after: 'User wants sortable + filtered table'
      }
    }
  ],
  metrics: {
    coupling: 23,
    hingeClarity: 87,
    iterationSpeed: 12.4,
    curvature: 72
  }
};

export const monolithicArchitecture: ArchitectureExample = {
  name: 'v0 Dashboard Generator (Monolithic)',
  domains: [
    {
      id: 'prompt',
      title: 'Prompt Domain',
      subtitle: 'The Input Lens',
      coherenceRules: [
        'Parse natural language',
        'Maintain conversation context',
        'ALSO generates some code directly',
        'ALSO renders partial previews'
      ],
      currentState: {
        description: 'Processing user intent + leaking to other domains',
        visual: 'Create a dark dashboard with metrics chart'
      },
      exportFormat: {
        type: 'text',
        content: 'Unstructured text + partial HTML + rendering hints'
      }
    },
    {
      id: 'generation',
      title: 'Generation Domain',
      subtitle: 'The Code Lens',
      coherenceRules: [
        'React hooks patterns',
        'ALSO interprets raw user input',
        'ALSO handles DOM events',
        'Multiple concerns mixed'
      ],
      currentState: {
        description: 'Generating code + handling other responsibilities',
        visual: 'Mixed concerns across domains'
      },
      exportFormat: {
        type: 'text',
        content: 'Mixed data structure with unclear boundaries'
      }
    },
    {
      id: 'preview',
      title: 'Preview Domain',
      subtitle: 'The Render Lens',
      coherenceRules: [
        'Browser DOM management',
        'ALSO generates code snippets',
        'ALSO parses user input',
        'Tightly coupled to generation'
      ],
      currentState: {
        description: 'Rendering + doing generation work',
        visual: 'Tangled responsibilities'
      },
      exportFormat: {
        type: 'text',
        content: 'Data leaks across boundaries'
      }
    },
    {
      id: 'feedback',
      title: 'Learning Curvature',
      subtitle: 'Intent Refinement',
      coherenceRules: [
        'Directly modifies all domains',
        'No clear interface',
        'Bypasses hinge planes',
        'Creates hidden dependencies'
      ],
      currentState: {
        description: 'Chaotic feedback without structure',
        visual: 'Unpredictable system behavior'
      },
      exportFormat: {
        type: 'text',
        content: 'Direct mutations everywhere'
      }
    }
  ],
  hinges: [
    {
      id: 'hinge1',
      fromDomain: 'prompt',
      toDomain: 'generation',
      label: 'Leaky Interface',
      icon: '⚠️',
      rotationType: 'None - Direct coupling',
      constraint: 'No constraints - everything passes through',
      transformation: {
        before: 'Raw unstructured data',
        after: 'Still unstructured + side effects'
      }
    },
    {
      id: 'hinge2',
      fromDomain: 'generation',
      toDomain: 'preview',
      label: 'Tight Coupling',
      icon: '⛓️',
      rotationType: 'None - Shared state',
      constraint: 'No schema validation',
      transformation: {
        before: 'Internal implementation details',
        after: 'Exposed internals causing brittleness'
      }
    },
    {
      id: 'hinge3',
      fromDomain: 'preview',
      toDomain: 'prompt',
      label: 'Chaos Loop',
      icon: '💥',
      rotationType: 'None - Direct mutations',
      constraint: 'No interface - bypasses boundaries',
      transformation: {
        before: 'Random system state changes',
        after: 'Unpredictable outcomes'
      }
    }
  ],
  metrics: {
    coupling: 89,
    hingeClarity: 12,
    iterationSpeed: 2.1,
    curvature: 18
  }
};
