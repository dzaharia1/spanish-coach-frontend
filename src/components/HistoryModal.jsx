import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { fetchHistory } from "../api/history";

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.large};
`;

const Panel = styled.div`
  width: min(640px, 100%);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.borderRadii.large};
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);

  @media (prefers-color-scheme: light) {
    background: ${({ theme }) => theme.lightTheme.colors.background};
    color: ${({ theme }) => theme.lightTheme.colors.text};
  }
  @media (prefers-color-scheme: dark) {
    background: ${({ theme }) => theme.darkTheme.colors.background};
    color: ${({ theme }) => theme.darkTheme.colors.text};
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.medium};
  padding: ${({ theme }) => theme.spacing.large};
  border-bottom: 1px solid;

  @media (prefers-color-scheme: light) {
    border-color: ${({ theme }) => theme.lightTheme.colors.border};
  }
  @media (prefers-color-scheme: dark) {
    border-color: ${({ theme }) => theme.darkTheme.colors.border};
  }
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.1rem;
`;

const CloseButton = styled.button`
  border: none;
  background: transparent;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xSmall}
    ${({ theme }) => theme.spacing.small};

  @media (prefers-color-scheme: light) {
    color: ${({ theme }) => theme.lightTheme.colors.text};
  }
  @media (prefers-color-scheme: dark) {
    color: ${({ theme }) => theme.darkTheme.colors.text};
  }
`;

const SearchRow = styled.div`
  padding: ${({ theme }) => theme.spacing.medium}
    ${({ theme }) => theme.spacing.large};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.small}
    ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadii.medium};
  border: 1px solid;
  font-size: 0.95rem;
  outline: none;

  @media (prefers-color-scheme: light) {
    border-color: ${({ theme }) => theme.lightTheme.colors.border};
    background: ${({ theme }) => theme.lightTheme.colors.backgroundSecondary};
    color: ${({ theme }) => theme.lightTheme.colors.text};
  }
  @media (prefers-color-scheme: dark) {
    border-color: ${({ theme }) => theme.darkTheme.colors.border};
    background: ${({ theme }) => theme.darkTheme.colors.backgroundSecondary};
    color: ${({ theme }) => theme.darkTheme.colors.text};
  }
`;

const List = styled.ul`
  flex: 1;
  margin: 0;
  padding: 0;
  list-style: none;
  overflow-y: auto;
`;

const Item = styled.li`
  padding: ${({ theme }) => theme.spacing.medium}
    ${({ theme }) => theme.spacing.large};
  cursor: pointer;
  border-bottom: 1px solid;
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: ${({ theme }) => theme.spacing.xSmall};

  @media (prefers-color-scheme: light) {
    border-color: ${({ theme }) => theme.lightTheme.colors.border};
  }
  @media (prefers-color-scheme: dark) {
    border-color: ${({ theme }) => theme.darkTheme.colors.border};
  }

  &:hover {
    @media (prefers-color-scheme: light) {
      background: ${({ theme }) => theme.lightTheme.colors.backgroundSecondary};
    }
    @media (prefers-color-scheme: dark) {
      background: ${({ theme }) => theme.darkTheme.colors.backgroundSecondary};
    }
  }
`;

const ItemInput = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemMeta = styled.div`
  font-size: 0.8rem;
  opacity: 0.65;
`;

const Empty = styled.div`
  padding: ${({ theme }) => theme.spacing.xLarge};
  text-align: center;
  opacity: 0.7;
`;

const Detail = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const DetailHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.medium}
    ${({ theme }) => theme.spacing.large};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  border-bottom: 1px solid;

  @media (prefers-color-scheme: light) {
    border-color: ${({ theme }) => theme.lightTheme.colors.border};
  }
  @media (prefers-color-scheme: dark) {
    border-color: ${({ theme }) => theme.darkTheme.colors.border};
  }
`;

const BackButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.95rem;
  padding: ${({ theme }) => theme.spacing.xSmall}
    ${({ theme }) => theme.spacing.small};

  @media (prefers-color-scheme: light) {
    color: ${({ theme }) => theme.lightTheme.colors.text};
  }
  @media (prefers-color-scheme: dark) {
    color: ${({ theme }) => theme.darkTheme.colors.text};
  }
`;

const DetailBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.large};
  text-align: left;
`;

const InputBlock = styled.div`
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  font-size: 1.05rem;
`;

const formatDate = (iso) => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return "";
  }
};

const HistoryModal = ({ open, onClose, user }) => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!open || !user) return undefined;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchHistory()
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, user]);

  useEffect(() => {
    if (!open) {
      setSelected(null);
      setSearch("");
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((t) => {
      const haystack =
        `${t.inputText || ""}\n${t.outputText || ""}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [items, search]);

  if (!open) return null;

  return (
    <Backdrop onClick={onClose}>
      <Panel onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>History</Title>
          <CloseButton onClick={onClose} aria-label="Close">
            ×
          </CloseButton>
        </Header>

        {selected ? (
          <Detail>
            <DetailHeader>
              <BackButton onClick={() => setSelected(null)}>← Back</BackButton>
              <ItemMeta>{formatDate(selected.createdAt)}</ItemMeta>
            </DetailHeader>
            <DetailBody>
              <InputBlock>{selected.inputText}</InputBlock>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {selected.outputText || ""}
              </ReactMarkdown>
            </DetailBody>
          </Detail>
        ) : (
          <>
            <SearchRow>
              <SearchInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your translations..."
              />
            </SearchRow>
            {loading && <Empty>Loading…</Empty>}
            {error && <Empty>{error}</Empty>}
            {!loading && !error && filtered.length === 0 && (
              <Empty>No translations yet.</Empty>
            )}
            {!loading && !error && filtered.length > 0 && (
              <List>
                {filtered.map((t) => (
                  <Item key={t.id} onClick={() => setSelected(t)}>
                    <ItemInput>{t.inputText}</ItemInput>
                    <ItemMeta>
                      {formatDate(t.createdAt)} ·{" "}
                      {t.languageMode === "spanishHelp" ? "EN→ES" : "ES→EN"} ·{" "}
                      {t.model}
                    </ItemMeta>
                  </Item>
                ))}
              </List>
            )}
          </>
        )}
      </Panel>
    </Backdrop>
  );
};

HistoryModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default HistoryModal;
