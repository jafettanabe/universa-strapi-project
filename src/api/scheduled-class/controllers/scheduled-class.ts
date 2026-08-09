import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::scheduled-class.scheduled-class', ({ strapi }) => ({
  async importClasses(ctx) {
    try {
      const { classes } = ctx.request.body;

      if (!Array.isArray(classes)) {
        return ctx.badRequest('El cuerpo de la petición debe contener un arreglo de clases en la propiedad "classes".');
      }

      const doc = strapi.documents.bind(strapi);

      // Fetch all programs to resolve names/slugs
      const allPrograms = await doc('api::program.program').findMany({
        fields: ['id', 'documentId', 'title', 'slug'],
        status: 'published'
      });

      const normalize = (s: string) => 
        (s || "")
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]/g, '')
          .trim();

      const programMap = new Map();
      allPrograms.forEach(p => {
        programMap.set(normalize(p.title), p.documentId);
        programMap.set(normalize(p.slug), p.documentId);
      });

      const results = [];
      const errors = [];

      for (let i = 0; i < classes.length; i++) {
        const row = classes[i];
        const { title, level, day, schedule, teacher, isFull, whatsappNumber, program } = row;

        // Validation: schedule is required
        if (!schedule) {
          errors.push(`Fila ${i + 1}: El horario (schedule) es obligatorio.`);
          continue;
        }

        // Resolve program relation
        let programDocId = null;
        if (program) {
          const normProg = normalize(String(program));
          programDocId = programMap.get(normProg) || null;
          if (!programDocId) {
            errors.push(`Fila ${i + 1}: No se encontró el programa "${program}".`);
            continue;
          }
        }

        // Validate level enum
        const validLevels = ["Básico", "Intermedio", "Intermedio Alto", "Avanzado", "Mixto"];
        let resolvedLevel = "Básico";
        if (level) {
          const found = validLevels.find(l => normalize(l) === normalize(String(level)));
          if (found) {
            resolvedLevel = found;
          } else {
            errors.push(`Fila ${i + 1}: Nivel inválido "${level}". Debe ser uno de: Básico, Intermedio, Intermedio Alto, Avanzado, Mixto.`);
            continue;
          }
        }

        // Create the scheduled class
        const created = await doc('api::scheduled-class.scheduled-class').create({
          data: {
            title: title || null,
            level: resolvedLevel,
            day: day || null,
            schedule: String(schedule),
            teacher: teacher || null,
            isFull: String(isFull).toLowerCase() === 'true',
            whatsappNumber: whatsappNumber || null,
            program: programDocId,
          },
          status: 'published' // Auto-publish so they show up immediately
        });

        results.push(created);
      }

      return ctx.send({
        message: `Importación completada. ${results.length} clases creadas.`,
        createdCount: results.length,
        errors,
      });

    } catch (err) {
      strapi.log.error('Error in importClasses controller:', err);
      return ctx.internalServerError('Ocurrió un error inesperado al importar las clases.');
    }
  }
}));
