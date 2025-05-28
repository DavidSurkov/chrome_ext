import { useEffect, useState } from "react";
import "./App.css";

async function copyTextToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    console.log("Text copied to clipboard");
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
}

interface PromptEntry {
  name: string;
  prompt: string;
  id: string;
}

interface StoreState {
  promptList: PromptEntry[];
}

class PromptStorage {
  private _storage: PromptEntry[] | null;
  constructor() {
    this._storage = null;
  }

  public async add(item: Omit<PromptEntry, "id">) {
    const curr = await this.getStorage();
    curr.push({ ...item, id: this.generateUUID() });
    return this.setStorage(curr);
  }

  public async delete(id: string) {
    const curr = await this.getStorage();
    return this.setStorage(
      curr.filter((e) => {
        return e.id !== id;
      }),
    );
  }

  public async list() {
    return this.getStorage();
  }

  private generateUUID() {
    return crypto.randomUUID();
  }

  private async getStorage(): Promise<PromptEntry[]> {
    if (this._storage === null) {
      const { promptList } = (await chrome.storage.local.get({
        promptList: [],
      })) as StoreState;
      this._storage = promptList;
    }
    return this._storage;
  }

  private async setStorage(items: PromptEntry[]): Promise<void> {
    await chrome.storage.local.set({ promptList: items });
    this._storage = items;
  }
}

const promptStorage = new PromptStorage();

const ListPrompts = () => {
  const [promptList, setPromptList] = useState<PromptEntry[]>([]);

  async function fetchPromptList() {
    const list = await promptStorage.list();
    setPromptList(list);
  }

  useEffect(() => {
    fetchPromptList();
  }, []);

  return (
    <ul style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      {promptList.length ? (
        promptList.map((promptItem) => {
          return (
            <li>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "3px" }}
              >
                <span style={{ fontWeight: "bold" }}>{promptItem.name}</span>
                <div>
                  <button
                    title="DL"
                    onClick={() => {
                      promptStorage.delete(promptItem.id).then(() => {
                        fetchPromptList();
                      });
                    }}
                  >
                    DL
                  </button>
                  <button
                    title="CP"
                    onClick={() => {
                      copyTextToClipboard(promptItem.prompt);
                    }}
                  >
                    CP
                  </button>
                </div>
                <span>{promptItem.prompt}</span>
              </div>
            </li>
          );
        })
      ) : (
        <div>No prompts saved</div>
      )}
    </ul>
  );
};

const SavePromopt = ({ selectedText }: { selectedText: string }) => {
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState(selectedText);

  const onSubmit = async () => {
    await promptStorage.add({ name, prompt });
    window.close();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
      <input
        value={name}
        onChange={(e) => {
          setName(e.currentTarget.value);
        }}
        type="text"
        placeholder="Name your prompt"
      />
      <textarea
        value={prompt}
        onChange={(e) => {
          setPrompt(e.currentTarget.value);
        }}
      />
      {/* <div>{selectedText}</div> */}
      <button onClick={onSubmit} disabled={!name}>
        Submit
      </button>
    </div>
  );
};

function App() {
  const params = new URLSearchParams(window.location.search);
  const selectedText = params.get("text");

  return (
    <>
      <div className="card">
        {selectedText ? (
          <SavePromopt selectedText={selectedText} />
        ) : (
          <ListPrompts />
        )}
      </div>
    </>
  );
}

export default App;
