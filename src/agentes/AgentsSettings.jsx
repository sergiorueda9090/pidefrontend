import React, { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Switch,
  Divider,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  Card,
  CardContent,
  Tooltip,
  IconButton,
  InputAdornment,
  Slider,
} from '@mui/material';

import {
  Save,
  SmartToy,
  SettingsEthernet,
  Key,
  Visibility,
  VisibilityOff,
  RestartAlt,
  Info,
  Build,
  Security,
  ListAlt,
} from '@mui/icons-material';

import AgentsTable from './AgentsTable';

import '../styles/Pages.css';
import '../styles/Settings.css';

const PROVIDERS = [
  {
    id: 'openai',
    label: 'OpenAI',
    models: ['gpt-4o-mini', 'gpt-4o', 'gpt-4.1-mini', 'gpt-4.1'],
    supportsBaseUrl: true,
  },
  {
    id: 'anthropic',
    label: 'Anthropic',
    models: ['claude-3-5-sonnet', 'claude-3-5-haiku', 'claude-3-opus'],
    supportsBaseUrl: false,
  },
  {
    id: 'google',
    label: 'Google (Gemini)',
    models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash'],
    supportsBaseUrl: false,
  },
  {
    id: 'mistral',
    label: 'Mistral',
    models: ['mistral-large', 'mistral-small', 'codestral'],
    supportsBaseUrl: true,
  },
  {
    id: 'local',
    label: 'Local / Self-hosted',
    models: ['llama-3.1', 'qwen2.5', 'mixtral'],
    supportsBaseUrl: true,
  },
];

const AgentsSettings = () => {
  // ✅ 0: Tabla | 1: General | 2: Provider | 3: Tools | 4: Security
  const [activeTab, setActiveTab] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const [agent, setAgent] = useState({
    name: 'Agente Ventas',
    description: 'Asistente para responder preguntas de productos y ayudar a cerrar ventas.',
    isActive: true,

    provider: 'openai',
    model: 'gpt-4o-mini',
    temperature: 0.4,
    maxTokens: 800,

    systemPrompt:
      'Eres un asistente de e-commerce. Responde claro, breve y orientado a conversión. Si falta información, pregunta antes de inventar.',

    apiKey: '',
    baseUrl: '',
    extraHeaders: '',

    tools: {
      webSearch: false,
      retrieveDocs: true,
      useProductsDb: true,
      useOrdersDb: false,
    },
  });

  const providerConfig = useMemo(
    () => PROVIDERS.find((p) => p.id === agent.provider),
    [agent.provider]
  );

  const modelsForProvider = providerConfig?.models ?? [];

  const handleChange = (field) => (event) => {
    const value = event.target.checked ?? event.target.value;
    setAgent((prev) => ({ ...prev, [field]: value }));
  };

  const handleToolsChange = (key) => (event) => {
    setAgent((prev) => ({
      ...prev,
      tools: { ...prev.tools, [key]: event.target.checked },
    }));
  };

  const handleProviderChange = (event) => {
    const newProvider = event.target.value;
    const newProviderConfig = PROVIDERS.find((p) => p.id === newProvider);

    setAgent((prev) => ({
      ...prev,
      provider: newProvider,
      model: newProviderConfig?.models?.[0] ?? '',
      baseUrl: '',
    }));
  };

  const resetDefaults = () => {
    setAgent((prev) => ({
      ...prev,
      temperature: 0.4,
      maxTokens: 800,
      systemPrompt:
        'Eres un asistente de e-commerce. Responde claro, breve y orientado a conversión. Si falta información, pregunta antes de inventar.',
      tools: {
        webSearch: false,
        retrieveDocs: true,
        useProductsDb: true,
        useOrdersDb: false,
      },
    }));
  };

  const validate = () => {
    if (!agent.name.trim()) return 'El nombre del agente es requerido.';
    if (!agent.provider) return 'Selecciona un proveedor.';
    if (!agent.model) return 'Selecciona un modelo.';
    if (agent.maxTokens < 64) return 'Max Tokens debe ser >= 64.';
    return null;
  };

  const handleSave = () => {
    const err = validate();
    if (err) {
      alert(err);
      return;
    }

    // ✅ Aquí conectas con tu API (Django) para guardar el agente:
    // await api.post('/agents/create/', agent)

    console.log('Guardando agente:', agent);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <Box className="page-container settings-container">
      {/* Header */}
      <Box className="settings-header">
        <Box>
          <Typography variant="h4" className="page-title settings-main-title">
            🤖 Agentes Inteligentes
          </Typography>
          <Typography variant="body2" className="page-subtitle settings-main-subtitle">
            Crea agentes y conéctalos a proveedores como OpenAI, Anthropic o Gemini.
          </Typography>
        </Box>

        {saveSuccess && (
          <Alert icon={<Save />} severity="success" className="settings-success-alert">
            Agente guardado correctamente
          </Alert>
        )}
      </Box>

      {/* Tabs */}
      <Paper className="page-paper settings-tabs-container" elevation={0}>
        <Tabs
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          className="settings-tabs-enhanced"
        >
          {/* ✅ NUEVO TAB: LISTADO */}
          <Tab icon={<ListAlt />} iconPosition="start" label="Agentes" className="settings-tab-item" />

          <Tab icon={<SmartToy />} iconPosition="start" label="General" className="settings-tab-item" />
          <Tab
            icon={<SettingsEthernet />}
            iconPosition="start"
            label="Proveedor & Modelo"
            className="settings-tab-item"
          />
          <Tab icon={<Build />} iconPosition="start" label="Herramientas" className="settings-tab-item" />
          <Tab icon={<Security />} iconPosition="start" label="Seguridad" className="settings-tab-item" />
        </Tabs>
      </Paper>

      {/* ✅ TAB 0: Tabla de Agentes */}
      {activeTab === 0 && (
        <Box className="settings-tab-content">
          <AgentsTable />
        </Box>
      )}

      {/* TAB 1: General */}
      {activeTab === 1 && (
        <Box className="settings-tab-content">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card className="settings-profile-card" elevation={0}>
                <CardContent>
                  <Box className="settings-profile-header">
                    <Box className="profile-info-section">
                      <Typography variant="h5" className="profile-name">
                        {agent.name || 'Nuevo Agente'}
                      </Typography>
                      <Typography variant="body2" className="profile-role">
                        {agent.description || 'Sin descripción'}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                        <Chip label={`Proveedor: ${providerConfig?.label ?? '-'}`} size="small" />
                        <Chip label={`Modelo: ${agent.model || '-'}`} size="small" />
                        <Chip
                          color={agent.isActive ? 'success' : 'default'}
                          label={agent.isActive ? 'Activo' : 'Inactivo'}
                          size="small"
                        />
                      </Box>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Activar agente
                      </Typography>
                      <Switch checked={agent.isActive} onChange={handleChange('isActive')} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Paper className="page-paper settings-section-enhanced">
                <Box className="settings-section-header-modern">
                  <Box className="settings-section-icon-wrapper">
                    <SmartToy className="settings-section-icon-large" />
                  </Box>
                  <Box>
                    <Typography variant="h6" className="settings-section-title-enhanced">
                      Configuración General
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Identidad del agente y comportamiento global
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nombre del Agente"
                      value={agent.name}
                      onChange={handleChange('name')}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Descripción"
                      value={agent.description}
                      onChange={handleChange('description')}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="System Prompt (instrucción base)"
                      value={agent.systemPrompt}
                      onChange={handleChange('systemPrompt')}
                      variant="outlined"
                      multiline
                      minRows={5}
                      helperText="Define el rol del agente, tono, reglas y límites."
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box className="settings-actions-modern">
                      <Tooltip title="Restaurar valores recomendados">
                        <Button variant="outlined" startIcon={<RestartAlt />} onClick={resetDefaults}>
                          Restablecer
                        </Button>
                      </Tooltip>
                      <Button
                        variant="contained"
                        startIcon={<Save />}
                        onClick={handleSave}
                        className="action-button settings-save-btn"
                      >
                        Guardar Agente
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* TAB 2: Proveedor & Modelo */}
      {activeTab === 2 && (
        <Box className="settings-tab-content">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className="page-paper settings-section-enhanced">
                <Box className="settings-section-header-modern">
                  <Box className="settings-section-icon-wrapper">
                    <SettingsEthernet className="settings-section-icon-large" />
                  </Box>
                  <Box>
                    <Typography variant="h6" className="settings-section-title-enhanced">
                      Proveedor y Modelo
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Selecciona el proveedor (OpenAI/Anthropic/Gemini/etc.) y ajusta parámetros.
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Proveedor</InputLabel>
                      <Select value={agent.provider} label="Proveedor" onChange={handleProviderChange}>
                        {PROVIDERS.map((p) => (
                          <MenuItem key={p.id} value={p.id}>
                            {p.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Modelo</InputLabel>
                      <Select value={agent.model} label="Modelo" onChange={handleChange('model')}>
                        {modelsForProvider.map((m) => (
                          <MenuItem key={m} value={m}>
                            {m}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ px: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="subtitle2">Temperatura</Typography>
                        <Chip label={Number(agent.temperature).toFixed(2)} size="small" />
                        <Tooltip title="Más bajo = más preciso. Más alto = más creativo.">
                          <Info fontSize="small" />
                        </Tooltip>
                      </Box>
                      <Slider
                        value={agent.temperature}
                        onChange={(e, val) => setAgent((p) => ({ ...p, temperature: val }))}
                        min={0}
                        max={1.5}
                        step={0.05}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Max Tokens"
                      type="number"
                      value={agent.maxTokens}
                      onChange={(e) =>
                        setAgent((p) => ({ ...p, maxTokens: Number(e.target.value || 0) }))
                      }
                      inputProps={{ min: 64, max: 8192 }}
                      helperText="Límite de salida. Ajusta según costos y tamaño de respuesta."
                    />
                  </Grid>

                  {providerConfig?.supportsBaseUrl && (
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Base URL (opcional)"
                        value={agent.baseUrl}
                        onChange={handleChange('baseUrl')}
                        placeholder="Ej: https://api.openai.com/v1 o tu gateway"
                        helperText="Útil si usas proxy, gateway o un proveedor compatible."
                      />
                    </Grid>
                  )}

                  <Grid item xs={12} md={providerConfig?.supportsBaseUrl ? 6 : 12}>
                    <TextField
                      fullWidth
                      label="Headers extra (JSON opcional)"
                      value={agent.extraHeaders}
                      onChange={handleChange('extraHeaders')}
                      placeholder='Ej: {"X-ORG":"my-org","X-ENV":"prod"}'
                      helperText="Si tu backend necesita headers adicionales (gateway/tenant)."
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* TAB 3: Herramientas */}
      {activeTab === 3 && (
        <Box className="settings-tab-content">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className="page-paper settings-section-enhanced">
                <Box className="settings-section-header-modern">
                  <Box className="settings-section-icon-wrapper">
                    <Build className="settings-section-icon-large" />
                  </Box>
                  <Box>
                    <Typography variant="h6" className="settings-section-title-enhanced">
                      Herramientas del Agente
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Activa capacidades extra (RAG, BD productos, pedidos, etc.).
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box className="settings-option-item">
                      <Box>
                        <Typography variant="body1">RAG (Documentos / PDFs)</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Permite consultar tu base de conocimiento.
                        </Typography>
                      </Box>
                      <Switch
                        checked={agent.tools.retrieveDocs}
                        onChange={handleToolsChange('retrieveDocs')}
                      />
                    </Box>
                    <Divider />
                    <Box className="settings-option-item">
                      <Box>
                        <Typography variant="body1">Base de datos de productos</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Consultar precios, stock, variantes, atributos.
                        </Typography>
                      </Box>
                      <Switch
                        checked={agent.tools.useProductsDb}
                        onChange={handleToolsChange('useProductsDb')}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box className="settings-option-item">
                      <Box>
                        <Typography variant="body1">Base de datos de pedidos</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Estado del pedido, tracking, devoluciones.
                        </Typography>
                      </Box>
                      <Switch
                        checked={agent.tools.useOrdersDb}
                        onChange={handleToolsChange('useOrdersDb')}
                      />
                    </Box>
                    <Divider />
                    <Box className="settings-option-item">
                      <Box>
                        <Typography variant="body1">Búsqueda Web</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Solo si realmente lo necesitas (costos + control).
                        </Typography>
                      </Box>
                      <Switch
                        checked={agent.tools.webSearch}
                        onChange={handleToolsChange('webSearch')}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Alert severity="info" icon={<Info />}>
                      Recomendación: para e-commerce, activa <b>Productos</b> y <b>RAG</b>. Evita Web Search si quieres respuestas 100% controladas.
                    </Alert>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* TAB 4: Seguridad */}
      {activeTab === 4 && (
        <Box className="settings-tab-content">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className="page-paper settings-section-enhanced">
                <Box className="settings-section-header-modern">
                  <Box className="settings-section-icon-wrapper">
                    <Key className="settings-section-icon-large" />
                  </Box>
                  <Box>
                    <Typography variant="h6" className="settings-section-title-enhanced">
                      Credenciales y Seguridad
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Recomendación: guarda las API Keys en el backend (Django) o vault. Evita exponerlas en el navegador.
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      label="API Key (opcional si tu backend la gestiona)"
                      type={showKey ? 'text' : 'password'}
                      value={agent.apiKey}
                      onChange={handleChange('apiKey')}
                      placeholder="Pega aquí tu API Key (si aplica)"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Key />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <Tooltip title={showKey ? 'Ocultar' : 'Mostrar'}>
                              <IconButton onClick={() => setShowKey((s) => !s)} edge="end">
                                {showKey ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                      helperText="Si el frontend guarda keys, cualquiera con DevTools podría verlas. Lo ideal es backend."
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box className="settings-actions-modern" style={{ justifyContent: 'flex-end' }}>
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<Save />}
                        onClick={handleSave}
                        className="action-button settings-save-btn"
                        fullWidth
                      >
                        Guardar
                      </Button>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Alert severity="warning" icon={<Security />}>
                      Si vas a conectar OpenAI/Anthropic/Gemini, lo más seguro es:
                      <b> Frontend → Backend (Django) → Proveedor</b>. El frontend nunca debe llamar directo al proveedor con tu key.
                    </Alert>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default AgentsSettings;
