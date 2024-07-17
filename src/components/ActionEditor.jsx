import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Pencil } from 'lucide-react';

const ActionEditor = () => {
  const [schema, setSchema] = useState({
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    properties: {}
  });
  const [expandedAction, setExpandedAction] = useState(null);
  const [newActionName, setNewActionName] = useState('');
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [error, setError] = useState('');
  const [editingActionName, setEditingActionName] = useState(null);

  const actionTypes = ['update_state', 'webhook', 'hang_up_call', 'transfer_call_to', 'send_sms', 'press_phone_keys'];
  const validators = ['email', 'date (MM/dd/yyy)', 'time (hh:mm aa)', 'datetimeiso'];

  const addAction = () => {
    if (newActionName && !schema.properties[newActionName]) {
      setSchema(prevSchema => ({
        ...prevSchema,
        properties: {
          ...prevSchema.properties,
          [newActionName]: {
            _description: '',
            _examples: [],
            type: 'object'
          }
        }
      }));
      setExpandedAction(newActionName);
      setNewActionName('');
    }
  };

  const removeAction = (actionName) => {
    setSchema(prevSchema => {
      const { [actionName]: _, ...rest } = prevSchema.properties;
      return {
        ...prevSchema,
        properties: rest
      };
    });
    if (expandedAction === actionName) {
      setExpandedAction(null);
    }
  };

  const updateAction = (actionName, field, value) => {
    setSchema(prevSchema => ({
      ...prevSchema,
      properties: {
        ...prevSchema.properties,
        [actionName]: {
          ...prevSchema.properties[actionName],
          [field]: value
        }
      }
    }));
  };

  const renameAction = (oldName, newName) => {
    if (newName && newName !== oldName && !schema.properties[newName]) {
      setSchema(prevSchema => {
        const { [oldName]: actionToRename, ...restProperties } = prevSchema.properties;
        return {
          ...prevSchema,
          properties: {
            ...restProperties,
            [newName]: actionToRename
          }
        };
      });
      if (expandedAction === oldName) {
        setExpandedAction(newName);
      }
    }
    setEditingActionName(null);
  };

  const updateExample = (actionName, index, field, value) => {
    setSchema(prevSchema => ({
      ...prevSchema,
      properties: {
        ...prevSchema.properties,
        [actionName]: {
          ...prevSchema.properties[actionName],
          _examples: prevSchema.properties[actionName]._examples.map((example, i) =>
            i === index ? { ...example, [field]: value } : example
          )
        }
      }
    }));
  };

  const updateExampleAction = (actionName, exampleIndex, exampleActionName, field, value) => {
    setSchema(prevSchema => ({
      ...prevSchema,
      properties: {
        ...prevSchema.properties,
        [actionName]: {
          ...prevSchema.properties[actionName],
          _examples: prevSchema.properties[actionName]._examples.map((example, i) =>
            i === exampleIndex ? {
              ...example,
              "assistant action includes": {
                ...example["assistant action includes"],
                [exampleActionName]: {
                  ...example["assistant action includes"][exampleActionName],
                  [field]: value
                }
              }
            } : example
          )
        }
      }
    }));
  };

  const addExample = (actionName) => {
    setSchema(prevSchema => ({
      ...prevSchema,
      properties: {
        ...prevSchema.properties,
        [actionName]: {
          ...prevSchema.properties[actionName],
          _examples: [
            ...(prevSchema.properties[actionName]._examples || []),
            { "user says": "", "assistant action includes": {} }
          ]
        }
      }
    }));
  };

  const addActionToExample = (actionName, exampleIndex, exampleActionName) => {
    setSchema(prevSchema => ({
      ...prevSchema,
      properties: {
        ...prevSchema.properties,
        [actionName]: {
          ...prevSchema.properties[actionName],
          _examples: prevSchema.properties[actionName]._examples.map((example, i) =>
            i === exampleIndex ? {
              ...example,
              "assistant action includes": {
                ...example["assistant action includes"],
                [exampleActionName]: {}
              }
            } : example
          )
        }
      }
    }));
  };

  const removeActionFromExample = (actionName, exampleIndex, exampleActionName) => {
    setSchema(prevSchema => ({
      ...prevSchema,
      properties: {
        ...prevSchema.properties,
        [actionName]: {
          ...prevSchema.properties[actionName],
          _examples: prevSchema.properties[actionName]._examples.map((example, i) => {
            if (i === exampleIndex) {
              const { [exampleActionName]: _, ...rest } = example["assistant action includes"];
              return {
                ...example,
                "assistant action includes": rest
              };
            }
            return example;
          })
        }
      }
    }));
  };

  const importSchema = () => {
    try {
      const parsedSchema = JSON.parse(importText);
      if (parsedSchema.type === 'object' && parsedSchema.properties) {
        setSchema(parsedSchema);
        setError('');
        setImportDialogOpen(false);
      } else {
        setError('Invalid schema structure. Ensure it has a "type" of "object" and a "properties" object.');
      }
    } catch (err) {
      setError('Invalid JSON. Please check your input.');
    }
  };

  const renderExamples = (actionName) => {
    const action = schema.properties[actionName];
    if (!action._examples) return null;

    return (
      <div className="space-y-4 mt-4">
        <Label>Examples</Label>
        {action._examples.map((example, exampleIndex) => (
          <Card key={exampleIndex} className="p-4">
            <div className="space-y-2">
              <Label>User says</Label>
              <Input
                value={example["user says"]}
                onChange={(e) => updateExample(actionName, exampleIndex, "user says", e.target.value)}
              />
            </div>
            <div className="space-y-2 mt-4">
              <Label>Assistant action includes</Label>
              {Object.entries(example["assistant action includes"]).map(([exampleActionName, actionValue]) => (
                <Card key={exampleActionName} className="p-2 mt-2">
                  <div className="flex justify-between items-center">
                    <Label>{exampleActionName}</Label>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => removeActionFromExample(actionName, exampleIndex, exampleActionName)}
                    >
                      Remove
                    </Button>
                  </div>
                  {Object.entries(actionValue).map(([field, value]) => (
                    <div key={field} className="mt-2">
                      <Label>{field}</Label>
                      <Input
                        value={value}
                        onChange={(e) => updateExampleAction(actionName, exampleIndex, exampleActionName, field, e.target.value)}
                      />
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => addActionToExample(actionName, exampleIndex, exampleActionName)}
                    className="mt-2"
                  >
                    Add Field
                  </Button>
                </Card>
              ))}
              <Select onValueChange={(value) => addActionToExample(actionName, exampleIndex, value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Add action to example" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(schema.properties).map(name => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>
        ))}
        <Button onClick={() => addExample(actionName)}>Add Example</Button>
      </div>
    );
  };

  const renderActionEditor = (actionName) => {
    const action = schema.properties[actionName];

    return (
      <div className="space-y-4 mt-4">
        <div>
          <Label>Description</Label>
          <Textarea
            value={action._description || ''}
            onChange={(e) => updateAction(actionName, '_description', e.target.value)}
          />
        </div>
        
        <div>
          <Label>Action Type</Label>
          <Select 
            value={action._action_type || ''}
            onValueChange={(value) => updateAction(actionName, '_action_type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select action type" />
            </SelectTrigger>
            <SelectContent>
              {actionTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {action._action_type === 'webhook' && (
          <div className="space-y-2">
            <div>
              <Label>Webhook URL</Label>
              <Input
                value={action._webhook_constants?.url || ''}
                onChange={(e) => updateAction(actionName, '_webhook_constants', { ...action._webhook_constants, url: e.target.value })}
              />
            </div>
            <div>
              <Label>HTTP Method</Label>
              <Select 
                value={action._webhook_constants?.method || ''}
                onValueChange={(value) => updateAction(actionName, '_webhook_constants', { ...action._webhook_constants, method: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="HTTP Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {renderExamples(actionName)}

        <div>
          <Label>Validators</Label>
          {validators.map(validator => (
            <div key={validator} className="flex items-center space-x-2">
              <Switch
                checked={action._validators?.[validator]}
                onCheckedChange={(checked) => {
                  const newValidators = { ...action._validators, [validator]: checked };
                  updateAction(actionName, '_validators', newValidators);
                }}
              />
              <span>{validator}</span>
            </div>
          ))}
        </div>

        <div>
          <Label>Dependencies</Label>
          <Input
            placeholder="Comma-separated state paths"
            value={action._depends_on?.join(', ') || ''}
            onChange={(e) => updateAction(actionName, '_depends_on', e.target.value.split(',').map(s => s.trim()))}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Action Editor
            <div className="space-x-2">
              <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Import</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Import JSON Schema</DialogTitle>
                  </DialogHeader>
                  <Textarea
                    className="mt-2"
                    placeholder="Paste your JSON schema here"
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    rows={10}
                  />
                  <Button onClick={importSchema}>Import</Button>
                  {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
                </DialogContent>
              </Dialog>
              <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Export</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Export JSON Schema</DialogTitle>
                  </DialogHeader>
                  <Textarea
                    className="mt-2"
                    value={JSON.stringify(schema, null, 2)}
                    readOnly
                    rows={10}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="New action name"
                value={newActionName}
                onChange={(e) => setNewActionName(e.target.value)}
              />
              <Button onClick={addAction}>Add Action</Button>
            </div>

            {Object.keys(schema.properties).map(actionName => (
              <Card key={actionName} className="p-4">
                <div className="flex justify-between items-center">
                  {editingActionName === actionName ? (
                    <Input
                      value={actionName}
                      onChange={(e) => renameAction(actionName, e.target.value)}
                      onBlur={() => setEditingActionName(null)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          renameAction(actionName, e.target.value);
                        }
                      }}
                      className="w-1/2"
                    />
                  ) : (
                    <h3 className="text-lg font-semibold flex items-center">
                      {actionName}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingActionName(actionName)}
                        className="ml-2"
                      >
                        <Pencil size={16} />
                      </Button>
                    </h3>
                  )}
                  <div className="space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setExpandedAction(expandedAction === actionName ? null : actionName)}
                    >
                      {expandedAction === actionName ? 'Collapse' : 'Expand'}
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => removeAction(actionName)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
                {expandedAction === actionName && renderActionEditor(actionName)}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActionEditor;