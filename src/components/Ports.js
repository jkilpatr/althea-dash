import React from "react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Progress,
  Row
} from "reactstrap";
import { connect, actions } from "../store";
import { translate } from "react-i18next";
import portImage from "../images/port.png";

class Ports extends React.Component {
  constructor() {
    super();
    this.state = {
      mode: null,
      modal: false,
      warning: false
    };
  }

  componentDidMount = () => {
    actions.getInterfaces();
    this.timer = setInterval(actions.getInterfaces, 5000);
  };

  componentWillUnmount = () => {
    clearInterval(this.timer);
  };

  setInterface = mode => {
    let { interfaces } = this.props.state;
    let warning = mode === "WAN" && Object.values(interfaces).includes("WAN");
    if (warning) return this.setState({ warning });

    this.setState({ mode, modal: true });
  };

  render() {
    let { t } = this.props;
    let { loadingInterfaces, interfaces, port } = this.props.state;
    let { modal, warning } = this.state;
    let modes = [t("Mesh"), t("WAN"), t("LAN")];

    if (!interfaces)
      if (loadingInterfaces !== null && !loadingInterfaces) {
        console.log("Alert");
        return <Alert color="info">No port interfaces found</Alert>;
      } else return <Progress animated color="info" value={100} />;

    let sorted = Object.keys(interfaces).sort();

    return (
      <div>
        <Confirm
          show={modal}
          t={t}
          cancel={() => this.setState({ modal: false })}
          confirm={() => {
            actions.setInterface(this.state.mode);
            this.setState({ modal: false });
          }}
        />
        <h2 style={{ marginTop: 20 }}>{t("ports")}</h2>
        <Row
          className="d-flex justify-content-center"
          style={{ marginBottom: 20 }}
        >
          {sorted.map((iface, i) => {
            if (iface[0] === "w") return null;

            return (
              <Card
                style={{ cursor: "pointer" }}
                onClick={() => {
                  actions.setPort(iface);
                  this.setState({ warning: false });
                }}
                className={port === iface ? "bg-primary" : null}
                key={i}
              >
                <CardBody>
                  <img src={portImage} alt={iface} width="60px" />
                  <span
                    style={{
                      position: "absolute",
                      top: 25,
                      left: 20,
                      fontWeight: "bold",
                      textAlign: "center",
                      textShadow: "2px 2px #666",
                      color: "white",
                      maxWidth: 60
                    }}
                  >
                    {iface} {interfaces[iface]}
                  </span>
                </CardBody>
              </Card>
            );
          })}
        </Row>
        <Row>
          <Col sm={12} md={{ size: 8, offset: 2 }}>
            <Card>
              <CardHeader>
                <CardTitle>{port}</CardTitle>
              </CardHeader>
              <CardBody>
                {warning && (
                  <Alert color="danger">
                    There can be only one WAN interface
                  </Alert>
                )}
                <p>
                  {t("mode")}: <strong>{interfaces[port]}</strong>
                </p>
                <p>{t("switchMode")}:</p>

                {modes.map((mode, i) => {
                  return (
                    <Button
                      color={
                        mode === interfaces[port] ? "secondary" : "primary"
                      }
                      key={i}
                      style={{ marginRight: 15 }}
                      disabled={mode === interfaces[port]}
                      onClick={() => this.setInterface(mode)}
                    >
                      {mode} {mode === "WAN" && t("gateway")}
                    </Button>
                  );
                })}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

const Confirm = ({ cancel, confirm, show, t }) => (
  <div>
    <Modal isOpen={show} centered>
      <ModalHeader>{t("Are you sure?")}</ModalHeader>
      <ModalBody>
        <Alert color="warning">
          This action will interrupt the connection to the router and require
          this page to be refreshed.
        </Alert>
        <p>Do you wish to proceed?</p>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={confirm}>
          Yes
        </Button>
        <Button color="secondary" onClick={cancel}>
          No
        </Button>
      </ModalFooter>
    </Modal>
  </div>
);

export default connect([
  "error",
  "loadingInterfaces",
  "port",
  "success",
  "interfaces"
])(translate()(Ports));
