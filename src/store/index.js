import { initStore } from "react-stateful";
import Backend from "../libs/backend";
import DaoActions from "./DaoActions";
import ExitActions from "./ExitActions";
import NeighborActions from "./NeighborActions";
import RouterActions from "./RouterActions";

const backend = new Backend();

const daoActions = DaoActions(backend);
const exitActions = ExitActions(backend);
const neighborActions = NeighborActions(backend);
const routerActions = RouterActions(backend);

const store = {
  initialState: {
    daos: [],
    daosError: null,
    error: null,
    exits: [],
    exitsError: null,
    loading: false,
    info: { balance: 0, version: "" },
    interfaces: [],
    neighbors: null,
    neighborsError: null,
    page: "",
    port: null,
    settings: {
      network: {
        ownIp: null
      },
      payment: {
        ethAddress: null
      }
    },
    success: false,
    t: () => {},
    wifiSettings: []
  },
  actions: {
    ...daoActions,
    ...exitActions,
    ...neighborActions,
    ...routerActions,
    changePage: (_, page) => ({ error: "", page: page }),
    init: async ({ setState, state }, t) => {
      setState({ t });
    },

    getInfo: async ({ setState, state }) => {
      setState({ loading: true });

      let info = await backend.getInfo();

      if (info instanceof Error) {
        return {
          error: state.t("infoError"),
          loading: false
        };
      }

      return { loading: false, info };
    },

    getSettings: async ({ setState, state }) => {
      setState({ loading: true });

      let settings = await backend.getSettings();

      if (settings instanceof Error) {
        return {
          error: state.t("settingsError"),
          loading: false
        };
      }

      return { loading: false, settings };
    }
  }
};

export const {
  Provider,
  Consumer,
  actions,
  getState,
  connect,
  subscribe
} = initStore(store);
