using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ProjetoDevAcademy.Api.Data;
using ProjetoDevAcademy.Api.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ProjetoDevAcademy.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegistroDto registroDto)
        {
            if (await _context.Usuarios.AnyAsync(u => u.Email == registroDto.Email))
            {
                return StatusCode(500, new { Mensagem = "Usuário já cadastrado" });
            }
            var novousuario = new Usuario
            {
                Email = registroDto.Email,
                Nome = registroDto.Nome,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registroDto.PasswordHash),
                Role = registroDto.Role,
            };
            await _context.Usuarios.AddAsync(novousuario);
            await _context.SaveChangesAsync();
            return Ok(new { Mensagem = "Usuário criado com sucesso." });

        }
        [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            var user = await _context.Usuarios.FirstOrDefaultAsync(
                u => u.Email == loginDto.Email);
            var passwordIsValid = BCrypt.Net.BCrypt.Verify
                (loginDto.Password, user.PasswordHash);

            if (user != null && passwordIsValid)
            {
                var token = CriarToken(user);
                return Ok(new {token});
            }
            return Unauthorized(new {Mensagem ="Credenciais inválidos"});

        }

        private string CriarToken(Usuario usuario)
        {
            var claims = new List<Claim>
            {
                new Claim("nome", usuario.Nome),
                new Claim("role", usuario.Role)
            };
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes("minha-chave-super-segura-com-32-caracteres"));

            var creds = new SigningCredentials
                (key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                signingCredentials: creds,
                expires: DateTime.Now.AddHours(2)
                );
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }
    }
}
