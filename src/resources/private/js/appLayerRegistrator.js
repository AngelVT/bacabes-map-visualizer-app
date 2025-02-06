const layerRegForm = document.getElementById('layer_form')

layerRegForm.addEventListener('submit', event =>  {
    event.preventDefault();

    uploadLayer(layerRegForm);
});

async function uploadLayer(form) {
    const formData = new FormData(form);

    const res = await fetch('/api/layer', {
        method: 'POST',
        credentials: 'include',
        body: formData
    });

    const response = await res.json();

    if (!res.ok) {
        alert(response.msg);
        return
    }

    form.reset();

    alert(`
        Capa registrada exitosamente:
        Nombre: ${response.layer.layer_name}
        Tipo: ${response.layer.layer_type}
        Visibilidad: ${response.layer.layer_visibility}`);
}