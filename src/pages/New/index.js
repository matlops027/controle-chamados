import { FiPlusCircle } from "react-icons/fi";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { useContext, useEffect, useState } from "react";
import "./new.css";
import { AuthContext } from "../../contexts/auth";
import { db } from "../../services/firebaseConnection";
import {
  collection,
  getDocs,
  addDoc,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";

import { useParams, useNavigate } from "react-router-dom";

const listRef = collection(db, "customers");

export default function New() {
  const [loadingCustomers, setLoadingCustomer] = useState(false);
  const [complemento, setComplemento] = useState("");
  const [status, setStatus] = useState("Suporte");
  const [assunto, setAssunto] = useState("Aberto");
  const [customerSelected, setCustomerSelected] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [idCustomer, setIdCustomer] = useState(false);

  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadCustomers();
  }, [id]);

  async function loadCustomers() {
    setLoadingCustomer(true);
    const querySnapshot = await getDocs(listRef)
      .then((snapshot) => {
        const lista = [];
        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            nomeFantasia: doc.data().nomeFantasia,
          });
        });
        if (snapshot.docs.size === 0) {
          setCustomers([{ id: "1", nomeFantasia: "FREELA" }]);
          return;
        }

        setCustomers(lista);
        setLoadingCustomer(false);

        if (id) {
          loadId(lista);
        }
      })
      .catch((error) => {
        setLoadingCustomer(false);
        setCustomers([{ id: "1", nomeFantasia: "FREELA" }]);
      });
  }

  async function loadId(lista) {
    const docRef = doc(db, "chamados", id);
    await getDoc(docRef)
      .then((snapshot) => {
        setAssunto(snapshot.data().assunto);
        setStatus(snapshot.data().status);
        setComplemento(snapshot.data().complemento);

        const index = lista.findIndex(
          (item) => item.id === snapshot.data().clienteId
        );
        setCustomerSelected(index);
        setIdCustomer(true);
      })
      .catch(() => {
        setIdCustomer(false);
      });
  }

  function handleOptionChange(e) {
    setStatus(e.target.value);
  }

  function handleChangeSelect(e) {
    setAssunto(e.target.value);
  }

  function handleChangeCustomer(e) {
    setCustomerSelected(e.target.value);
  }

  async function handleRegister(e) {
    e.preventDefault();

    if (idCustomer) {
      const docRef = doc(db, "chamados", id);
      await updateDoc(docRef, {
        cliente: customers[customerSelected].nomeFantasia,
        clienteId: customers[customerSelected].id,
        assunto: assunto,
        complemento: complemento,
        status: status,
        userId: user.uid,
      })
        .then(() => {
          toast.info("Chamado atualizado com sucesso!");
          setCustomerSelected(0);
          setComplemento("");
          navigate("/dashboard");
        })
        .catch(() => {
          toast.error("Ops, erro ao atualizar esse chamado!");
        });
    } else {
      await addDoc(collection(db, "chamados"), {
        created: new Date(),
        cliente: customers[customerSelected].nomeFantasia,
        clienteId: customers[customerSelected].id,
        assunto: assunto,
        complemento: complemento,
        status: status,
        userId: user.uid,
      })
        .then(() => {
          toast.success("Chamado registrado!");
          setCustomerSelected(0);
          setComplemento("");
        })
        .catch(() => {
          toast.error("Ops erro ao registrar, tente mais tarde!");
        });
    }
  }

  return (
    <div>
      <Header />
      <div className="content">
        <Title name={id ? "Editando chamado" : "Novo chamado"}>
          <FiPlusCircle size={25} />
        </Title>

        <div className="container">
          <form onSubmit={handleRegister} className="form-profile">
            <label>Clientes</label>
            {loadingCustomers ? (
              <input type="text" disabled={true} value="Carregando..." />
            ) : (
              <select value={customerSelected} onChange={handleChangeCustomer}>
                {customers.map((item, index) => {
                  return (
                    <option key={index} value={index}>
                      {item.nomeFantasia}
                    </option>
                  );
                })}
              </select>
            )}

            <label>Assunto</label>
            <select value={assunto} onChange={handleChangeSelect}>
              <option value={"Suporte"}>Suporte</option>
              <option value={"Visita técnica"}>Visita técnica</option>
              <option value={"Financeiro"}>Financeiro</option>
            </select>

            <label>Status</label>
            <div className="status">
              <input
                type="radio"
                name="radio"
                value={"Aberto"}
                onChange={handleOptionChange}
                checked={status === "Aberto"}
              />
              <span>Em aberto</span>

              <input
                type="radio"
                name="radio"
                value={"Progresso"}
                onChange={handleOptionChange}
                checked={status === "Progresso"}
              />
              <span>Progresso</span>

              <input
                type="radio"
                name="radio"
                value={"Atendido"}
                onChange={handleOptionChange}
                checked={status === "Atendido"}
              />
              <span>Atendido</span>
            </div>

            <label>Complemento</label>
            <textarea
              type="text"
              placeholder="Descreva seu problema (opcional)."
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
            />

            <button type="submit">Registrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
