using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjetoDevAcademy.Api.Data;
using ProjetoDevAcademy.Api.Models;

namespace ProjetoDevAcademy.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CursosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CursosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<List<CursoResponseDto>>> GetCursos()
        {
            var cursos = await _context.Cursos.Select(c => new CursoResponseDto
            {
                Titulo = c.Titulo,
                Descricao = c.Descricao,
                CargaHoraria = c.CargaHoraria,
                Id = c.Id
            }).ToListAsync();
            return Ok(cursos);
        }

        [HttpPost]
        [Authorize(Roles = "admin , professor")]
        public async Task<IActionResult> CriarCurso(CursoCreateDto cursoCreateDto)
        {
            var newCurso = new Curso
            {
                Titulo = cursoCreateDto.Titulo,
                Descricao = cursoCreateDto.Descricao,
                CargaHoraria = cursoCreateDto.CargaHoraria
            };
            await _context.AddAsync(newCurso);
            await _context.SaveChangesAsync();
            return Ok(newCurso);
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = "admin,professor")]
        public async Task<IActionResult> DeleteCurso(int id)
        {
            var curso = await _context.Cursos.FindAsync(id);

            _context.Cursos.Remove(curso);
            await _context.SaveChangesAsync();
            return StatusCode(204, new { Mensagem = "Curso removido" });
        }

    }
}
